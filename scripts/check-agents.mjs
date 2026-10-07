import { readFile, readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep, basename } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const agentsDir = join(root, '.agents');
const checkAll = process.argv.includes('--all');

const findings = [];
const notes = [];

const fail = (code, message) => findings.push({ code, message });
const pass = (code, message) => notes.push({ code, message });

const posix = (p) => relative(root, p).split(sep).join('/');

async function exists(path) {
	try {
		await stat(path);
		return true;
	} catch {
		return false;
	}
}

const SKIP_DIRS = new Set(['node_modules', '.git', '.svelte-kit', 'build', 'dist', 'target', '.opencode']);

async function walk(dir, out = []) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		if (entry.isDirectory()) {
			if (!SKIP_DIRS.has(entry.name)) await walk(join(dir, entry.name), out);
		} else {
			out.push(join(dir, entry.name));
		}
	}
	return out;
}

const read = (path) => readFile(path, 'utf8');

const RULES = [
	'identity.md',
	'no-comments.md',
	'verification.md',
	'git-workflow.md',
	'frontend.md',
	'backend.md',
	'security.md',
	'headless-shell.md',
	'doc-truthfulness.md',
	'i18n.md',
	'installer.md',
	'release.md',
	'context-management.md',
];

const SKILLS = [
	'onboard.md',
	'implement-feature.md',
	'fix-bug.md',
	'review-change.md',
	'update-docs.md',
	'cut-release.md',
];

const TEMPLATES = [
	'commit-message.md',
	'pull-request.md',
	'bug-report.md',
	'feature-spec.md',
	'changelog.md',
	'release-notes.md',
	'release-announcement.md',
	'agent.md',
	'root-plan-file-template.md',
	'root-todo-file-template.md',
	'root-roadmap-file-template.md',
	'root-bugs-file-template.md',
];

const ROLES = {
	engineer: ['frontend', 'backend', 'installer'],
	reviewer: ['correctness', 'security'],
	planner: ['roadmap'],
	steward: ['docs', 'i18n'],
};

const SOURCE_EXT = new Set(['.ts', '.js', '.svelte', '.rs', '.css', '.mjs']);
const SOURCE_DIRS = ['src', join('src-tauri', 'src')];

const ALLOWED_COMMENT_PREFIXES = ['// @ts-', '/* eslint', '/* prettier', '//#!'];

const BRANDING = [
	[/\bnhentai[\s-]*(app|client|desktop)\b/i, 'app branded as "nhentai ..."'],
	[/\bNClient\b/, 'third-party name "NClient" used as our product name'],
	[/\blewd-clips-app\b/, 'workspace folder name used as a product identifier'],
];

const NEGATION = /\bno\b|\bnot\b|never|\bnor\b|forbid|misnomer|wrong|instead of|rename/i;

const AGENTS_MD = join(root, 'AGENTS.md');
const ROLES_MD = join(agentsDir, 'ROLES.md');
const COPILOT_MD = join(root, '.github', 'copilot-instructions.md');
const IDENTITY_RULE = join(agentsDir, 'rules', 'identity.md');

let repoFiles = null;
async function allRepoFiles() {
	if (repoFiles) return repoFiles;
	// Only version-controlled files participate in the gate. Gitignored,
	// local-only artifacts (scratch/, caches) never exist on a fresh clone,
	// so they must neither be scanned nor used to satisfy references.
	try {
		const out = execFileSync('git', ['--no-pager', 'ls-files', '--cached', '--others', '--exclude-standard'], {
			cwd: root,
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		});
		repoFiles = out.split(/\r?\n/).filter(Boolean).map((n) => join(root, n));
	} catch {
		repoFiles = await walk(root, []);
	}
	return repoFiles;
}

// Gitignored paths are local-only by policy: they legitimately do not exist
// on a fresh clone or in CI, so references into them are exempt from
// existence checks.
const isGitIgnored = (path) => {
	const rel = relative(root, path);
	if (!rel || rel.startsWith('..')) return false;
	try {
		execFileSync('git', ['check-ignore', '-q', '--', rel.split(sep).join('/')], {
			cwd: root,
			stdio: ['ignore', 'ignore', 'ignore'],
		});
		return true;
	} catch {
		return false;
	}
};

async function changedSourceFiles() {
	if (checkAll) {
		const all = await allRepoFiles();
		return all.filter(
			(f) => SOURCE_DIRS.some((d) => posix(f).startsWith(`${d.split(sep).join('/')}/`)) && SOURCE_EXT.has(f.slice(f.lastIndexOf('.'))),
		);
	}
	let names = [];
	const git = (args) => {
		try {
			return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
		} catch {
			return '';
		}
	};
	names = git(['--no-pager', 'diff', '--name-only', 'HEAD']).split(/\r?\n/).filter(Boolean);
	names.push(...git(['ls-files', '--others', '--exclude-standard']).split(/\r?\n/).filter(Boolean));
	return names.map((n) => join(root, n)).filter((f) => SOURCE_EXT.has(f.slice(f.lastIndexOf('.'))));
}

async function checkStructure() {
	if (!(await exists(AGENTS_MD))) {
		fail('STRUCTURE', 'AGENTS.md is missing — it is the always-loaded authority.');
		return;
	}
	if (!(await exists(agentsDir))) {
		fail('STRUCTURE', '.agents/ is missing.');
		return;
	}
	if (!(await exists(ROLES_MD))) fail('STRUCTURE', '.agents/ROLES.md is missing.');
	if (!(await exists(COPILOT_MD))) fail('STRUCTURE', '.github/copilot-instructions.md is missing.');

	for (const rule of RULES) {
		if (!(await exists(join(agentsDir, 'rules', rule)))) fail('RULE', `missing rule: .agents/rules/${rule}`);
	}
	for (const skill of SKILLS) {
		if (!(await exists(join(agentsDir, 'skills', skill)))) fail('SKILL', `missing skill: .agents/skills/${skill}`);
	}
	for (const tpl of TEMPLATES) {
		if (!(await exists(join(agentsDir, 'templates', tpl)))) fail('TEMPLATE', `missing template: .agents/templates/${tpl}`);
	}
	for (const [primary, subs] of Object.entries(ROLES)) {
		if (!(await exists(join(agentsDir, 'agents', primary, 'README.md')))) {
			fail('ROLE', `missing primary role: .agents/agents/${primary}/README.md`);
		}
		for (const sub of subs) {
			if (!(await exists(join(agentsDir, 'agents', primary, sub, 'README.md')))) {
				fail('ROLE', `missing sub role: .agents/agents/${primary}/${sub}/README.md`);
			}
		}
	}

	pass(
		'STRUCTURE',
		`${RULES.length} rules, ${SKILLS.length} skills, ${TEMPLATES.length} templates, ${Object.keys(ROLES).length} primaries present.`,
	);
}

async function checkRuleHeaders() {
	for (const rule of RULES) {
		const path = join(agentsDir, 'rules', rule);
		if (!(await exists(path))) continue;
		const body = await read(path);
		for (const [label, field] of [
			['Status', '**Status:**'],
			['Triggers', '**Triggers:**'],
			['Enforced by', '**Enforced by:**'],
		]) {
			if (!body.includes(field)) fail('RULE-HEADER', `${posix(path)} is missing **${label}:**`);
		}
	}
	pass('RULE-HEADER', 'every rule declares Status, Triggers, and Enforced by.');
}

async function checkRoleContract() {
	for (const primary of Object.keys(ROLES)) {
		for (const name of ['README.md', ...ROLES[primary].map((s) => join(s, 'README.md'))]) {
			const path = join(agentsDir, 'agents', primary, name);
			if (!(await exists(path))) continue;
			const body = await read(path);
			for (const [label, field] of [
				['Owns', '**Owns:**'],
				['Reads', '**Reads:**'],
				['Hands off to', '**Hands off to:**'],
				['Does', '## Does'],
				['Never', '## Never'],
			]) {
				if (!body.includes(field)) fail('ROLE-CONTRACT', `${posix(path)} is missing **${label}**`);
			}
		}
	}
	pass('ROLE-CONTRACT', 'every role declares Owns, Reads, Does, Never, Hands off to.');
}

async function checkBrokenLinks() {
	const files = [AGENTS_MD, ROLES_MD, COPILOT_MD, ...(await walk(agentsDir))].filter((f) => f.endsWith('.md'));
	const all = await allRepoFiles();
	const byBase = new Map();
	for (const f of all) {
		const key = basename(f);
		byBase.set(key, [...(byBase.get(key) ?? []), f]);
	}

	const candidate = /(?<![\w*<>{}+./])(?:\.{0,2}\/)?[\w.-]+(?:\/[\w.*<>-]+)*\.(?:md|mjs|json|jsonc|ts|rs|css|svelte)\b/g;

	for (const file of files) {
		if (!(await exists(file))) continue;
		const lines = (await read(file)).split(/\r?\n/);
		for (const [index, line] of lines.entries()) {
			for (const match of line.matchAll(candidate)) {
				const ref = match[0];
				if (/[*<>{}]/.test(ref)) continue;
				if (ref.startsWith('http')) continue;
				if (NEGATION.test(`${lines[index - 1] ?? ''} ${line}`)) continue;

				const direct = [
					join(root, ref),
					join(dirname(file), ref),
					join(root, '.agents', ref.replace(/^\.agents\//, '')),
					join(agentsDir, 'agents', ref),
				];
				let found = false;
				for (const path of direct) {
					if (await exists(path)) {
						found = true;
						break;
					}
				}
				if (found) continue;

				// References into gitignored locations target local-only
				// artifacts (e.g. scratch/) that will not exist on a fresh
				// clone — exempt them from the existence requirement.
				if (direct.some((path) => isGitIgnored(path))) continue;

				const suffix = `/${ref.replace(/^\.\//, '')}`;
				if (all.some((f) => posix(f).endsWith(suffix))) continue;

				if (!ref.includes('/')) {
					const hits = byBase.get(basename(ref)) ?? [];
					if (hits.length === 1) continue;
				}

				fail('LINK', `${posix(file)}:${index + 1} references ${ref}, which does not exist`);
			}
		}
	}
	pass('LINK', 'all file references inside the ecosystem resolve (gitignored local-only targets exempt).');
}

async function checkBranding() {
	const targets = [
		...(await walk(agentsDir)),
		AGENTS_MD,
		COPILOT_MD,
		join(root, 'package.json'),
		join(root, 'src-tauri', 'tauri.conf.json'),
	].filter((f) => /\.(md|json|jsonc)$/.test(f));

	for (const file of targets) {
		if (!(await exists(file)) || file === IDENTITY_RULE) continue;
		const lines = (await read(file)).split(/\r?\n/);
		lines.forEach((line, index) => {
			const context = `${line} ${lines[index + 1] ?? ''}`;
			if (NEGATION.test(context)) return;
			for (const [pattern, why] of BRANDING) {
				if (pattern.test(line)) fail('BRANDING', `${posix(file)}:${index + 1} ${why}`);
			}
		});
	}
	pass('BRANDING', 'no app branding derived from the website name or the folder name.');
}

async function checkSourcePolicy() {
	const files = (await changedSourceFiles()).filter((f) => posix(f) !== 'scripts/check-agents.mjs');

	for (const file of files) {
		if (!(await exists(file))) continue;
		const rel = posix(file);
		const ext = file.slice(file.lastIndexOf('.'));
		const body = await read(file);

		if (ext === '.rs') {
			const panicLines = body
				.split(/\r?\n/)
				.map((line, index) => [line, index + 1])
				.filter(([line]) => /^\s*(panic!|todo!|unimplemented!)/.test(line));
			for (const [, line] of panicLines) fail('RUST', `${rel}:${line} panic!/todo!/unimplemented!`);

			const prod = body.split('#[cfg(test)]')[0];
			prod.split(/\r?\n/).forEach((line, index) => {
				const hits = line.match(/\.unwrap\(\)|\.expect\(/g);
				if (hits) fail('RUST', `${rel}:${index + 1} .unwrap()/.expect() in non-test code (${hits.length})`);
			});
		}

		if (['.ts', '.svelte', '.js', '.mjs'].includes(ext)) {
			body.split(/\r?\n/).forEach((line, index) => {
				const hits = line.match(/:\s*any\b|as any\b|<any>/g);
				if (hits) fail('TYPE', `${rel}:${index + 1} explicit any (${hits.length})`);
			});
		}

		body.split(/\r?\n/).forEach((line, index) => {
			const trimmed = line.trim();
			if (!trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) return;
			if (trimmed.length < 12) return;
			if (ALLOWED_COMMENT_PREFIXES.some((p) => trimmed.startsWith(p))) return;
			fail('COMMENT', `${rel}:${index + 1} explanatory comment — no-comments.md forbids these`);
		});
	}

	const scope = checkAll ? 'whole tree' : 'files changed vs HEAD';
	pass('SOURCE', `${files.length} ${scope} scanned for comment / any / unwrap policy.`);
}

async function checkDocsScripts() {
	let pkg;
	try {
		pkg = JSON.parse(await read(join(root, 'package.json')));
	} catch {
		fail('DOCS', 'package.json is unreadable or invalid JSON');
		return;
	}
	const scripts = pkg.scripts ?? {};
	const before = findings.length;
	for (const required of ['check', 'check:i18n', 'check:agents']) {
		if (!scripts[required]) fail('DOCS', `package.json is missing the "${required}" script`);
	}
	for (const match of (await read(AGENTS_MD)).matchAll(/`npm run ([\w:-]+)`/g)) {
		if (!scripts[match[1]]) fail('DOCS', `AGENTS.md documents "npm run ${match[1]}", which is not in package.json`);
	}
	if (findings.length === before) pass('DOCS', 'every documented npm script exists.');
}

await checkStructure();
await checkRuleHeaders();
await checkRoleContract();
await checkBrokenLinks();
await checkBranding();
await checkSourcePolicy();
await checkDocsScripts();

for (const note of notes) console.log(`  ok   ${note.code.padEnd(13)} ${note.message}`);

if (findings.length === 0) {
	console.log(`\ncheck:agents passed — ecosystem intact. Source policy scope: ${checkAll ? 'whole tree' : 'changed vs HEAD'}.\n`);
	process.exit(0);
}

const byCode = new Map();
for (const finding of findings) {
	if (!byCode.has(finding.code)) byCode.set(finding.code, []);
	byCode.get(finding.code).push(finding.message);
}

console.log('');
for (const [code, messages] of byCode) {
	console.log(`  FAIL ${code} (${messages.length})`);
	for (const message of messages) console.log(`       ${message}`);
}
console.log(`\ncheck:agents failed — ${findings.length} finding(s). See AGENTS.md §2.\n`);
process.exit(1);
