# Installation & Maintenance

NH Reader ships via **native Tauri packaging** (`tauri build`), providing rock-solid platform-native installers across Windows, macOS, and Linux with full dependency and resource bundling, alongside mobile targets for Android and iOS.

## 📦 Distribution Formats

| Platform | Formats | Package Type | Default Install Target |
| --- | --- | --- | --- |
| **Windows** | NSIS (`.exe`), WiX (`.msi`), Portable (`.zip`) | Installer / MSI / Standalone | `%LOCALAPPDATA%\Programs\NH Reader` (per-user) or `C:\Program Files\NH Reader` (all-users) |
| **macOS** | DMG (`.dmg`), App bundle (`.app`) | Disk Image / Bundle | `/Applications` |
| **Linux** | Debian (`.deb`), AppImage (`.AppImage`) | Native package / Self-contained | `/usr/bin` (deb) or user directory |
| **Android** | APK (`.apk`), AAB (`.aab`) | Sideloadable Android Package | Device storage / App drawer |
| **iOS** | IPA (`.ipa`), Sideload Bundle | iOS App Archive | Sideloaded / Apple Silicon macOS |

---

## 📦 Installing on Desktop

### 📦 Windows

1. Download `NH Reader_<version>_x64-setup.exe` (NSIS) or `NH Reader_<version>_x64_en-US.msi` (WiX) from the [Releases](https://github.com/HELIX-Origin/NH-Reader/releases) page.
2. Run the installer:
   - **NSIS Setup**: Supports both **Current User** (per-user, non-elevated) and **All Users** (per-machine, administrative) installation scopes, custom directory selection, and creates Desktop / Start Menu shortcuts.
   - **WiX MSI**: Standard enterprise-ready Windows Installer package with silent install capability (`msiexec /i ... /qn`).
3. Launch `NH Reader` from the Start Menu or Desktop shortcut.

### 📦 macOS

1. Download `NH Reader_<version>_x64.dmg` (or `aarch64` for Apple Silicon).
2. Open the DMG disk image and drag **NH Reader** into the **Applications** folder.
3. Launch from Launchpad or `/Applications`. *(Note: For ad-hoc unsigned builds on macOS, control-click the app and choose "Open" on first launch to approve Gatekeeper).*

### 📦 Linux

1. Download `nh-reader_<version>_amd64.deb` or `nh-reader_<version>_amd64.AppImage`.
2. For Debian/Ubuntu:
   ```bash
   sudo dpkg -i nh-reader_<version>_amd64.deb
   ```
3. For AppImage:
   ```bash
   chmod +x nh-reader_<version>_amd64.AppImage
   ./nh-reader_<version>_amd64.AppImage
   ```

---

## 📱 Mobile Platforms & Sideloading

NH Reader leverages Tauri 2's cross-platform mobile toolchain to provide full-featured reading on touch devices.

> [!IMPORTANT]
> **Hardware Testing Notice**: The project maintainer does not possess physical Android, macOS, or iOS test devices. While Tauri 2 mobile tooling and builds are configured and output valid standalone packages, **Android and iOS builds are currently community-supported and untested by the maintainer**. Feedback and community testing are welcomed.

### 🤖 Android (APK Sideloading)

1. Download the release `.apk` (e.g. `nh-reader_<version>_universal.apk`) to your Android device.
2. Open the downloaded file using your device's file manager or browser download manager.
3. If prompted, grant permission to "Install unknown apps" for that application in system settings.
4. Complete installation and open NH Reader from your home screen or app drawer.
5. *Developer Note*: To build from source, run `npm run mobile:android:init` followed by `npm run mobile:android:build`. Android keystores can be generated completely free using Android SDK's `keytool`.

### 🍎 iOS & Apple Silicon macOS (Sideloading)

NH Reader can be built for iOS using `npm run mobile:ios:init` and `npm run mobile:ios:build`.

- **Apple Silicon macOS Sideloading (Primary Focus)**: iOS application bundles (`.ipa` / `.app`) can be installed and run natively on M-series Apple Silicon Macs without requiring jailbreaking, developer accounts, or special certificates (using tools like PlayCover or standard ad-hoc provisioning).
- **Sideloaded iOS Devices**: Users can install the `.ipa` onto compatible iPhones/iPads using personal free Apple ID provisioning tools (such as AltStore, Sideloadly, or TrollStore where supported).

> [!CAUTION]
> **Mandatory Jailbreak Disclaimer**
> 
> NH Reader provides native iOS package targets for community testing and Apple Silicon macOS usage. **No technical support, customer assistance, or warranty is provided for users who brick, damage, crash, or compromise their devices by attempting to jailbreak their phones.** Jailbreaking alters core system firmware and security measures; any jailbreaking attempts are performed solely at your own risk.

---

## 🧳 Portable Mode

NH Reader supports a 100% self-contained portable mode:
1. Download or extract the standalone application executable.
2. Place a `.portable` empty marker file (or create a `data/` folder) next to `nh-reader.exe`.
3. When launched, the application stores the SQLite database (`database.sqlite`), image cache, and download files entirely within the local directory rather than the OS app-data locations.
4. *Note: PortableApps (.paf.exe) format was dropped in favor of clean portable zip distributions and native installers.*

---

## 🛠️ Uninstallation

- **Windows**: Use standard Windows **Settings → Installed Apps** (or **Control Panel → Programs and Features**) to uninstall cleanly. The NSIS and MSI uninstallers remove installed files, registry keys, and shortcuts.
- **macOS**: Drag **NH Reader.app** from `/Applications` to the Trash.
- **Linux**: Run `sudo apt remove nh-reader` (for `.deb`) or remove the AppImage file.
- **Android**: Long-press the NH Reader icon and select **Uninstall**.

User data (favorites, blacklist, and settings stored in `database.sqlite`) is preserved by default. To perform a complete factory reset on desktop, remove the `%LOCALAPPDATA%\NH Reader` directory.

---

## 🔐 Zero-Cost Code Signing

### Free Code Signing (Zero Budget / No API Keys)

- **Windows**: Uses a self-signed code signing certificate generated locally with PowerShell (`New-SelfSignedCertificate`) stored in `certificates/` as `.pfx`. This signs the binaries for integrity without requiring a paid Commercial CA certificate.
- **macOS**: Uses ad-hoc code signing (`codesign -s -`) built into the macOS command line. Apple Developer ID notarization requires a paid $99/year subscription and is not required for local use or sideloading.
- **Linux**: GPG signatures can be generated freely using `gpg --detach-sign`.
- **Android**: Can be built and signed completely free using Android SDK `keytool` to generate a release keystore (`keytool -genkey -v -keystore release.keystore`). Sideloading `.apk` is natively supported on all Android devices.

---

- Related: [Getting Started](Getting-Started) · [Architecture](Architecture) · [Security](Security)