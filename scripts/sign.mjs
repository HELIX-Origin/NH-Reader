import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const USAGE = [
	'Usage: npm run sign [-- options] [-- file ...]',
	'',
	'Opt-in signing step for NH Reader. It never runs as part of a build:',
	'run it deliberately (after `npm run tauri:build:release`) when you want signed artifacts.',
	'',
	'With no file arguments, signs the artifacts discovered for this platform:',
	'  windows   nh-reader.exe, the portable exe, and every .exe/.msi under src-tauri/target/release/bundle',
	'  macOS     every .app under src-tauri/target/release/bundle/macos (plus notarization when credentials are set)',
	'  linux     every package under bundle/appimage, bundle/deb and bundle/rpm (gpg detached signature)',
	'  any OS    any discovered .apk (apksigner)',
	'',
	'Options:',
	'  --dry-run           print targets and commands without signing anything',
	'  --ios               build and sign the iOS archive with xcodebuild (macOS only);',
	'                      every other argument is forwarded to xcodebuild as build settings',
	'  --identity <name>   codesign identity (default: $APPLE_SIGNING_IDENTITY, else the only',
	'                      codesigning identity found in the keychain)',
	'  --cert <path>       code-signing PFX on Windows (default: certificates/*.pfx or $WINDOWS_CERTIFICATE_BASE64)',
	'  --cert-pass <pass>  PFX password (default: $WINDOWS_CERTIFICATE_PASSWORD, else "nh-reader")',
	'  --ks <path>         keystore for apksigner (default: src-tauri/gen/android/release.keystore)',
	'  --ks-alias <alias>  key alias for apksigner (default: nh-reader)',
	'  -h, --help          show this help',
	'',
	'Environment:',
	'  APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID   notarize and staple the .app when all three are set',
	'  APPLE_SIGNING_IDENTITY                                default codesign identity',
	'  WINDOWS_CERTIFICATE_BASE64, WINDOWS_CERTIFICATE_PASSWORD   Windows certificate materialization',
	'  APKSIGNER, ANDROID_HOME, ANDROID_SDK_ROOT, ANDROID_KEYSTORE_PASSWORD   Android tooling',
	'',
	'Examples:',
	'  npm run sign',
	'  npm run sign -- --dry-run',
	'  npm run sign -- "src-tauri/target/release/bundle/nsis/NH Reader_0.7.4_x64-setup.exe"',
	'  npm run sign -- --ios CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM=ABC123',
	'  npm run sign -- --identity "Developer ID Application: Name (TEAMID)"',
].join('\n')

const SECRETS = new Set()

function fail(message) {
	console.error(`sign: ${message}`)
	process.exit(1)
}

function log(message) {
	console.log(`sign: ${message}`)
}

function usageError(message) {
	console.error(`sign: ${message}`)
	console.error('run `npm run sign -- --help` for usage')
	process.exit(2)
}

function parseArgs(argv) {
	const opts = {
		dry: false,
		ios: false,
		help: false,
		identity: null,
		cert: null,
		certPass: null,
		ks: null,
		ksAlias: null,
		forwarded: [],
		targets: [],
	}
	const value = (flag, index) => {
		if (index + 1 >= argv.length) usageError(`missing value for ${flag}`)
		return argv[index + 1]
	}
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]
		if (arg === '-h' || arg === '--help') opts.help = true
		else if (arg === '--dry-run') opts.dry = true
		else if (arg === '--ios') opts.ios = true
		else if (arg === '--') continue
		else if (arg === '--identity') {
			opts.identity = value(arg, i)
			i++
		} else if (arg.startsWith('--identity=')) opts.identity = arg.slice('--identity='.length)
		else if (arg === '--cert') {
			opts.cert = value(arg, i)
			i++
		} else if (arg.startsWith('--cert=')) opts.cert = arg.slice('--cert='.length)
		else if (arg === '--cert-pass') {
			opts.certPass = value(arg, i)
			i++
		} else if (arg.startsWith('--cert-pass=')) opts.certPass = arg.slice('--cert-pass='.length)
		else if (arg === '--ks') {
			opts.ks = value(arg, i)
			i++
		} else if (arg.startsWith('--ks=')) opts.ks = arg.slice('--ks='.length)
		else if (arg === '--ks-alias') {
			opts.ksAlias = value(arg, i)
			i++
		} else if (arg.startsWith('--ks-alias=')) opts.ksAlias = arg.slice('--ks-alias='.length)
		else if (arg.startsWith('--')) usageError(`unknown option ${arg}`)
		else opts.targets.push(arg)
	}
	if (opts.ios) {
		opts.forwarded.push(...opts.targets)
		opts.targets = []
	}
	return opts
}

function echoCommand(cmd, args) {
	const parts = [cmd, ...args].map((a) => {
		const s = String(a)
		if (SECRETS.has(s)) return '***'
		return s.includes(' ') ? JSON.stringify(s) : s
	})
	console.log(`sign: $ ${parts.join(' ')}`)
}

function run(cmd, args, opts = {}) {
	echoCommand(cmd, args)
	if (opts.dry) return 0
	const res = spawnSync(cmd, args, {
		stdio: 'inherit',
		cwd: ROOT,
		env: { ...process.env, ...(opts.env ?? {}) },
	})
	if (res.error) {
		if (res.error.code === 'ENOENT') fail(opts.missing ?? `${cmd} not found`)
		fail(`${cmd}: ${res.error.message}`)
	}
	return res.status ?? 1
}

function walk(dir) {
	const out = []
	let entries
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true })
	} catch {
		return out
	}
	for (const entry of entries) {
		const full = path.join(dir, entry.name)
		if (entry.isDirectory()) out.push(...walk(full))
		else out.push(full)
	}
	return out
}

function discover() {
	const bundle = path.join(ROOT, 'src-tauri', 'target', 'release', 'bundle')
	const found = []
	const push = (p) => {
		if (fs.existsSync(p)) found.push(p)
	}
	if (process.platform === 'win32') {
		push(path.join(ROOT, 'src-tauri', 'target', 'release', 'nh-reader.exe'))
		push(path.join(ROOT, 'src-tauri', 'target', 'release', 'portable', 'NH Reader.exe'))
		for (const f of walk(bundle)) {
			if (/\.(exe|msi)$/i.test(f)) found.push(f)
		}
	}
	if (process.platform === 'darwin') {
		const macDir = path.join(bundle, 'macos')
		try {
			for (const e of fs.readdirSync(macDir, { withFileTypes: true })) {
				if (e.isDirectory() && e.name.endsWith('.app')) found.push(path.join(macDir, e.name))
			}
		} catch {}
	}
	if (process.platform === 'linux') {
		for (const sub of ['appimage', 'deb', 'rpm']) {
			for (const f of walk(path.join(bundle, sub))) {
				if (!f.endsWith('.asc')) found.push(f)
			}
		}
	}
	for (const f of walk(path.join(ROOT, 'src-tauri', 'gen', 'android', 'app', 'build', 'outputs', 'apk'))) {
		if (f.endsWith('.apk')) found.push(f)
	}
	const targetDir = path.join(ROOT, 'src-tauri', 'target')
	try {
		for (const e of fs.readdirSync(targetDir, { withFileTypes: true })) {
			if (!e.isDirectory()) continue
			for (const f of walk(path.join(targetDir, e.name, 'release', 'apk'))) {
				if (f.endsWith('.apk')) found.push(f)
			}
		}
	} catch {}
	return [...new Set(found)]
}

function route(targets) {
	const groups = { windows: [], apple: [], android: [], gpg: [] }
	for (const t of targets) {
		const lower = t.toLowerCase()
		if (lower.endsWith('.exe') || lower.endsWith('.msi')) {
			if (process.platform !== 'win32') fail(`${path.basename(t)} can only be signed on Windows (signtool)`)
			groups.windows.push(t)
		} else if (lower.endsWith('.app') || lower.endsWith('.dmg')) {
			if (process.platform !== 'darwin') fail(`${path.basename(t)} can only be signed on macOS (codesign)`)
			groups.apple.push(t)
		} else if (lower.endsWith('.apk')) groups.android.push(t)
		else groups.gpg.push(t)
	}
	return groups
}

function inspectSelfSigned(file, pass) {
	const script = [
		'try { $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($env:NH_SIGN_PFX_FILE, $env:NH_SIGN_PFX_PASS) -ErrorAction Stop } catch { exit 10 }',
		'if ($cert.Issuer -eq $cert.Subject) { exit 0 } else { exit 1 }',
	].join('; ')
	const res = spawnSync('powershell', ['-NoProfile', '-Command', script], {
		stdio: 'ignore',
		cwd: ROOT,
		env: { ...process.env, NH_SIGN_PFX_FILE: file, NH_SIGN_PFX_PASS: pass },
	})
	if (res.error) fail('powershell not found — needed to inspect the code-signing certificate')
	if (res.status === 0) return true
	if (res.status === 1) return false
	fail(`cannot read the code-signing certificate at ${file} — check --cert-pass or WINDOWS_CERTIFICATE_PASSWORD`)
}

function resolveCert(opts) {
	const pass = opts.certPass ?? process.env.WINDOWS_CERTIFICATE_PASSWORD ?? 'nh-reader'
	if (opts.cert) {
		const p = path.resolve(ROOT, opts.cert)
		if (!fs.existsSync(p)) fail(`certificate not found: ${p}`)
		return { file: p, pass, selfSigned: inspectSelfSigned(p, pass) }
	}
	for (const candidate of ['certificates/nh-reader-codesign.pfx', 'certificates/nh-desktop-codesign.pfx']) {
		const p = path.join(ROOT, candidate)
		if (fs.existsSync(p)) return { file: p, pass, selfSigned: inspectSelfSigned(p, pass) }
	}
	if (process.env.WINDOWS_CERTIFICATE_BASE64) {
		const p = path.join(ROOT, 'certificates', 'nh-reader-codesign.pfx')
		fs.mkdirSync(path.dirname(p), { recursive: true })
		fs.writeFileSync(p, Buffer.from(process.env.WINDOWS_CERTIFICATE_BASE64, 'base64'))
		log(`materialized certificate from WINDOWS_CERTIFICATE_BASE64 -> ${p}`)
		return { file: p, pass, selfSigned: inspectSelfSigned(p, pass) }
	}
	return { file: path.join(ROOT, 'certificates', 'nh-reader-codesign.pfx'), pass, selfSigned: true }
}

function ensureCert(cert, dry) {
	if (!cert.selfSigned || fs.existsSync(cert.file)) return
	if (dry) {
		log(`would generate a self-signed certificate at ${cert.file} (not a trusted publisher identity)`)
		return
	}
	log('no certificate found — generating a local self-signed code-signing certificate')
	fs.mkdirSync(path.dirname(cert.file), { recursive: true })
	const script = [
		"$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject 'CN=HELIX Origin, O=HELIX Origin, OU=NH Reader' -CertStoreLocation 'Cert:\\CurrentUser\\My'",
		'$pwd = ConvertTo-SecureString -String $env:NH_SIGN_PFX_PASS -Force -AsPlainText',
		`Export-PfxCertificate -Cert $cert -FilePath '${cert.file.replace(/'/g, "''")}' -Password $pwd | Out-Null`,
	].join('; ')
	const st = run('powershell', ['-NoProfile', '-Command', script], {
		env: { NH_SIGN_PFX_PASS: cert.pass },
		missing: 'powershell not found — needed to generate a self-signed certificate',
	})
	if (st !== 0) fail('failed to generate the self-signed certificate')
	if (!fs.existsSync(cert.file)) fail(`certificate was not created at ${cert.file}`)
}

function findSigntool() {
	const base = 'C:\\Program Files (x86)\\Windows Kits\\10\\bin'
	try {
		const versions = fs
			.readdirSync(base)
			.filter((v) => /^\d/.test(v))
			.sort()
			.reverse()
		for (const v of versions) {
			const p = path.join(base, v, 'x64', 'signtool.exe')
			if (fs.existsSync(p)) return p
		}
	} catch {}
	return 'signtool.exe'
}

function signWindows(files, opts, dry) {
	const cert = resolveCert(opts)
	SECRETS.add(cert.pass)
	ensureCert(cert, dry)
	const signtool = findSigntool()
	const missing = 'signtool.exe not found — install the Windows 10/11 SDK'
	for (const f of files) {
		log(`windows: signing ${path.relative(ROOT, f)}`)
		const signed = run(
			signtool,
			['sign', '/f', cert.file, '/p', cert.pass, '/fd', 'sha256', '/tr', 'http://timestamp.digicert.com', '/td', 'sha256', f],
			{ dry, missing },
		)
		if (signed !== 0) fail(`signtool sign failed for ${f}`)
		if (cert.selfSigned) {
			const probe = [
				`$s = Get-AuthenticodeSignature -LiteralPath '${f.replace(/'/g, "''")}'`,
				"if ($s.SignerCertificate -and $s.Status -ne 'HashMismatch' -and $s.Status -ne 'NotSigned') { exit 0 }",
				"Write-Host \"signature status: $($s.Status) - $($s.StatusMessage)\"",
				'exit 1',
			].join('; ')
			const verified = run('powershell', ['-NoProfile', '-Command', probe], {
				dry,
				missing: 'powershell not found — needed to verify the signature',
			})
			if (verified !== 0) fail(`signature verification failed for ${f}`)
		} else if (run(signtool, ['verify', '/pa', f], { dry, missing }) !== 0) {
			fail(`signature verification failed for ${f}`)
		}
		if (dry) continue
		if (cert.selfSigned) log(`windows: verified signature on ${path.basename(f)} (self-signed, not trust-chain verified)`)
		else log(`windows: verified signature on ${path.basename(f)}`)
	}
}

function macIdentity(opts) {
	if (opts.identity) return opts.identity
	if (process.env.APPLE_SIGNING_IDENTITY) return process.env.APPLE_SIGNING_IDENTITY
	const res = spawnSync('security', ['find-identity', '-v', '-p', 'codesigning'], { encoding: 'utf8', cwd: ROOT })
	if (res.error) fail('security not found — cannot determine a codesign identity, pass --identity')
	const ids = [...(res.stdout ?? '').matchAll(/\d+\)\s+[0-9A-F]+\s+"(.+)"/g)].map((m) => m[1])
	if (ids.length === 1) return ids[0]
	if (ids.length === 0) fail('no codesigning identity found — create one in Keychain Access or pass --identity')
	fail(`multiple codesigning identities found — pass --identity or set APPLE_SIGNING_IDENTITY:\n  ${ids.join('\n  ')}`)
}

function notarize(apps, dry) {
	const enabled = ['APPLE_ID', 'APPLE_APP_SPECIFIC_PASSWORD', 'APPLE_TEAM_ID'].every((k) => process.env[k])
	if (!enabled) {
		if (apps.length) log('notarization skipped — set APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD and APPLE_TEAM_ID to enable it')
		return
	}
	SECRETS.add(process.env.APPLE_APP_SPECIFIC_PASSWORD)
	for (const app of apps) {
		const zip = `${app}.notarize.zip`
		log(`macos: notarizing ${path.basename(app)}`)
		if (!dry) fs.rmSync(zip, { force: true })
		if (run('ditto', ['-c', '-k', '--keepParent', app, zip], { dry, missing: 'ditto not found' }) !== 0)
			fail(`failed to zip ${app} for notarization`)
		const submitted = run(
			'xcrun',
			[
				'notarytool',
				'submit',
				zip,
				'--apple-id',
				process.env.APPLE_ID,
				'--password',
				process.env.APPLE_APP_SPECIFIC_PASSWORD,
				'--team-id',
				process.env.APPLE_TEAM_ID,
				'--wait',
			],
			{ dry, missing: 'xcrun notarytool not found' },
		)
		if (submitted !== 0) fail(`notarization failed for ${app}`)
		if (run('xcrun', ['stapler', 'staple', app], { dry, missing: 'xcrun stapler not found' }) !== 0)
			fail(`failed to staple ${app}`)
		if (run('xcrun', ['stapler', 'validate', app], { dry }) !== 0) fail(`staple validation failed for ${app}`)
		if (!dry) fs.rmSync(zip, { force: true })
		if (!dry) log(`macos: ${path.basename(app)} notarized and stapled`)
	}
}

function signApple(files, opts, dry) {
	const identity = macIdentity(opts)
	for (const f of files) {
		log(`macos: signing ${path.relative(ROOT, f)} (${identity})`)
		const signed = run('codesign', ['--force', '--deep', '--options', 'runtime', '--timestamp', '--sign', identity, f], {
			dry,
			missing: 'codesign not found — install Xcode Command Line Tools',
		})
		if (signed !== 0) fail(`codesign failed for ${f}`)
		const verified = run('codesign', ['--verify', '--deep', '--strict', '--verbose=2', f], {
			dry,
			missing: 'codesign not found — install Xcode Command Line Tools',
		})
		if (verified !== 0) fail(`codesign verification failed for ${f}`)
		if (!dry) log(`macos: verified signature on ${path.basename(f)}`)
	}
	notarize(
		files.filter((f) => f.toLowerCase().endsWith('.app')),
		dry,
	)
}

function signLinux(files, dry) {
	for (const f of files) {
		log(`linux: signing ${path.relative(ROOT, f)}`)
		const signed = run('gpg', ['--armor', '--detach-sign', f], { dry, missing: 'gpg not found — install GnuPG' })
		if (signed !== 0) fail(`gpg signing failed for ${f}`)
		const asc = `${f}.asc`
		if (run('gpg', ['--verify', asc, f], { dry, missing: 'gpg not found — install GnuPG' }) !== 0)
			fail(`gpg verification failed for ${asc}`)
		if (!dry) log(`linux: verified ${path.basename(asc)}`)
	}
}

function findApksigner() {
	if (process.env.APKSIGNER) return process.env.APKSIGNER
	for (const sdk of [process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT].filter(Boolean)) {
		const bt = path.join(sdk, 'build-tools')
		let versions = []
		try {
			versions = fs
				.readdirSync(bt)
				.filter((v) => !v.startsWith('.'))
				.sort()
				.reverse()
		} catch {
			continue
		}
		for (const v of versions) {
			for (const name of ['apksigner.bat', 'apksigner']) {
				const p = path.join(bt, v, name)
				if (fs.existsSync(p)) return p
			}
		}
	}
	return process.platform === 'win32' ? 'apksigner.bat' : 'apksigner'
}

function signAndroid(files, opts, dry) {
	const apksigner = findApksigner()
	const absolute = apksigner.includes(path.sep) || apksigner.includes('/')
	if (absolute && !fs.existsSync(apksigner)) fail(`apksigner not found at ${apksigner} — install Android SDK build-tools or set APKSIGNER`)
	const keystore = opts.ks ? path.resolve(ROOT, opts.ks) : path.join(ROOT, 'src-tauri', 'gen', 'android', 'release.keystore')
	if (!fs.existsSync(keystore))
		fail(`keystore not found at ${keystore} — generate one (see docs/Installation-and-Maintenance.md) or pass --ks`)
	const alias = opts.ksAlias ?? 'nh-reader'
	if (process.env.ANDROID_KEYSTORE_PASSWORD) SECRETS.add(process.env.ANDROID_KEYSTORE_PASSWORD)
	const invoke = (extra, dryRun) => {
		if (apksigner.toLowerCase().endsWith('.bat')) return run('cmd.exe', ['/c', apksigner, ...extra], dryRun)
		return run(apksigner, extra, dryRun)
	}
	for (const f of files) {
		log(`android: signing ${path.relative(ROOT, f)}`)
		const args = ['sign', '--ks', keystore, '--ks-key-alias', alias]
		if (process.env.ANDROID_KEYSTORE_PASSWORD) args.push('--ks-pass', 'env:ANDROID_KEYSTORE_PASSWORD')
		args.push(f)
		if (invoke(args, { dry, missing: 'apksigner not found — install Android SDK build-tools or set APKSIGNER' }) !== 0)
			fail(`apksigner failed for ${f}`)
		if (invoke(['verify', f], { dry, missing: 'apksigner not found — install Android SDK build-tools or set APKSIGNER' }) !== 0)
			fail(`apksigner verification failed for ${f}`)
		if (!dry) log(`android: verified signature on ${path.basename(f)}`)
	}
}

function signIos(opts, dry) {
	if (process.platform !== 'darwin') fail('--ios requires macOS with Xcode')
	const project = path.join(ROOT, 'src-tauri', 'gen', 'ios', 'nh-reader.xcodeproj')
	if (!fs.existsSync(project)) fail('iOS project not found — run: npm run tauri:ios:init')
	const archive = path.join(ROOT, 'src-tauri', 'target', 'ios', 'NHReader.xcarchive')
	const args = [
		'-project',
		project,
		'-scheme',
		'nh-reader',
		'-configuration',
		'Release',
		'-destination',
		'generic/platform=iOS',
		'-archivePath',
		archive,
		'archive',
		...opts.forwarded,
	]
	log('ios: building a signed archive with xcodebuild')
	if (run('xcodebuild', args, { dry, missing: 'xcodebuild not found — install Xcode' }) !== 0)
		fail('xcodebuild archive failed')
	if (!dry && !fs.existsSync(archive)) fail(`archive not found at ${archive}`)
	log(dry ? 'ios: dry run complete — nothing built' : `ok — signed archive at ${path.relative(ROOT, archive)}`)
}

function main() {
	const opts = parseArgs(process.argv.slice(2))
	if (opts.help) {
		console.log(USAGE)
		return
	}
	if (opts.ios) {
		signIos(opts, opts.dry)
		return
	}
	let targets = opts.targets.map((t) => path.resolve(ROOT, t))
	for (const t of targets) {
		if (!fs.existsSync(t)) fail(`target not found: ${t}`)
	}
	if (!targets.length) {
		targets = discover()
		if (!targets.length)
			fail('nothing to sign — build first (npm run tauri:build:release) or pass files explicitly')
	}
	log(`platform ${process.platform} — ${targets.length} target(s)`)
	const groups = route(targets)
	if (groups.windows.length) signWindows(groups.windows, opts, opts.dry)
	if (groups.apple.length) signApple(groups.apple, opts, opts.dry)
	if (groups.android.length) signAndroid(groups.android, opts, opts.dry)
	if (groups.gpg.length) signLinux(groups.gpg, opts.dry)
	log(opts.dry ? 'dry run complete — nothing signed' : `ok — ${targets.length} target(s) signed and verified`)
}

try {
	main()
} catch (error) {
	fail(error?.message ?? String(error))
}
