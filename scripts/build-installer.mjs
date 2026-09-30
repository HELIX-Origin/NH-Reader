import { execSync } from 'node:child_process';
import { copyFileSync, mkdirSync, chmodSync, writeFileSync, existsSync, unlinkSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const version = pkg.version;
const product = 'NH Desktop';
const binName = 'nh-desktop';

console.log(`Building ${product} release binary...`);
execSync('npx tauri build --no-bundle', { cwd: root, stdio: 'inherit' });

const outDir = join(root, 'dist', 'installer');
mkdirSync(outDir, { recursive: true });

const isWindows = process.platform === 'win32';
let srcBin = join(root, 'src-tauri', 'target', 'release');
if (isWindows) {
  srcBin = join(srcBin, `${binName}.exe`);
} else {
  srcBin = join(srcBin, binName);
}

const platformTag =
  process.platform === 'win32'
    ? `win-${process.arch}`
    : process.platform === 'darwin'
      ? `macos-${process.arch}`
      : `linux-${process.arch}`;
const ext = isWindows ? '.exe' : '';
const versionedName = `${product}-Setup-${version}-${platformTag}${ext}`;
const genericName = `${product}-Setup-${platformTag}${ext}`;

copyFileSync(srcBin, join(outDir, versionedName));
console.log(`Copied -> ${join(outDir, versionedName)}`);

copyFileSync(srcBin, join(outDir, genericName));
if (!isWindows) {
  chmodSync(join(outDir, versionedName), 0o755);
  chmodSync(join(outDir, genericName), 0o755);
}
console.log(`Copied -> ${join(outDir, genericName)}`);

if (isWindows) {
  const pafDir = join(outDir, 'NHDesktopPortable');
  const appInfoDir = join(pafDir, 'App', 'AppInfo');
  const appBinDir = join(pafDir, 'App', 'NHDesktop');
  mkdirSync(appInfoDir, { recursive: true });
  mkdirSync(appBinDir, { recursive: true });
  mkdirSync(join(pafDir, 'Data'), { recursive: true });

  const appinfoContent = `[Format]
Type=PortableApps.comFormat
Version=3.7

[Details]
Name=NH Desktop Portable
AppId=NHDesktopPortable
Publisher=HELIX Origin
Homepage=https://github.com/HELIX-Origin/nhentai-desktop
Category=Internet
Description=A lightweight desktop client for nhentai.net
Language=Multilingual

[License]
Shareable=true
OpenSource=true
Freeware=true
CommercialUse=true

[Version]
PackageVersion=${version}.0
DisplayVersion=${version}

[Control]
Icons=1
Start=NHDesktopPortable.exe
`;
  writeFileSync(join(appInfoDir, 'appinfo.ini'), appinfoContent, 'utf8');

  const icoPath = join(root, 'src-tauri', 'icons', 'icon.ico');
  const p32Path = join(root, 'src-tauri', 'icons', '32x32.png');
  const p128Path = join(root, 'src-tauri', 'icons', '128x128.png');

  if (existsSync(icoPath)) copyFileSync(icoPath, join(appInfoDir, 'appicon.ico'));
  if (existsSync(p32Path)) {
    copyFileSync(p32Path, join(appInfoDir, 'appicon_16.png'));
    copyFileSync(p32Path, join(appInfoDir, 'appicon_32.png'));
  }
  if (existsSync(p128Path)) copyFileSync(p128Path, join(appInfoDir, 'appicon_128.png'));

  const portableTargetExe = join(appBinDir, `${product}.exe`);
  copyFileSync(srcBin, portableTargetExe);
  writeFileSync(join(appBinDir, '.portable'), '', 'utf8');

  copyFileSync(srcBin, join(pafDir, 'NHDesktopPortable.exe'));
  writeFileSync(join(pafDir, '.portable'), '', 'utf8');

  function findMakensis() {
    try {
      const out = execSync('where.exe makensis', { stdio: 'pipe' }).toString().trim().split('\r\n')[0];
      if (out && existsSync(out)) return out;
    } catch {}
    const candidates = [
      'C:\\Program Files (x86)\\NSIS\\makensis.exe',
      'C:\\Program Files\\NSIS\\makensis.exe',
    ];
    for (const c of candidates) {
      if (existsSync(c)) return c;
    }
    return null;
  }

  const makensis = findMakensis();
  if (makensis) {
    console.log(`Found NSIS at ${makensis}, compiling PAF installer...`);
    const launcherNsi = join(outDir, 'launcher.nsi');
    const pafLauncherExe = join(pafDir, 'NHDesktopPortable.exe');
    const launcherScript = `!include "FileFunc.nsh"
RequestExecutionLevel user
SilentInstall silent
OutFile "${pafLauncherExe.replaceAll('\\', '\\\\')}"
Icon "${icoPath.replaceAll('\\', '\\\\')}"

Section
  SetOutPath "$EXEDIR\\\\App\\\\NHDesktop"
  Exec '"$EXEDIR\\\\App\\\\NHDesktop\\\\NH Desktop.exe"'
SectionEnd
`;
    writeFileSync(launcherNsi, launcherScript, 'utf8');
    try {
      execSync(`"${makensis}" "${launcherNsi}"`, { stdio: 'inherit' });
    } finally {
      if (existsSync(launcherNsi)) unlinkSync(launcherNsi);
    }

    const pafInstallerNsi = join(outDir, 'paf.nsi');
    const pafOutExe = join(outDir, `NHDesktopPortable_${version}.paf.exe`);
    const pafScript = `!include "MUI2.nsh"
!include "FileFunc.nsh"

Name "NH Desktop Portable"
OutFile "${pafOutExe.replaceAll('\\', '\\\\')}"
InstallDir "$PROGRAMFILES\\\\PortableApps\\\\NHDesktopPortable"
RequestExecutionLevel user

!define MUI_ICON "${icoPath.replaceAll('\\', '\\\\')}"
!define MUI_UNICON "${icoPath.replaceAll('\\', '\\\\')}"

!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "Main"
  SetOutPath "$INSTDIR"
  File /r "${pafDir.replaceAll('\\', '\\\\')}\\\\*.*"
  CreateDirectory "$INSTDIR\\\\Data"
SectionEnd
`;
    writeFileSync(pafInstallerNsi, pafScript, 'utf8');
    try {
      execSync(`"${makensis}" "${pafInstallerNsi}"`, { stdio: 'inherit' });
      console.log(`Generated PAF installer -> ${pafOutExe}`);
    } finally {
      if (existsSync(pafInstallerNsi)) unlinkSync(pafInstallerNsi);
    }
  } else {
    console.log('NSIS (makensis) not found; skipping .paf.exe generation.');
  }

  try {
    const zipName = `NHDesktopPortable_${version}.zip`;
    execSync(`tar -a -c -f "${join(outDir, zipName)}" -C "${outDir}" NHDesktopPortable`, { stdio: 'inherit' });
    console.log(`Generated Portable Zip -> ${join(outDir, zipName)}`);
  } catch (err) {
    console.warn(`Could not create portable zip archive: ${err}`);
  }

  if (existsSync(pafDir)) {
    rmSync(pafDir, { recursive: true, force: true });
  }
}

console.log('Done.');