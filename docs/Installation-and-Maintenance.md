---

> **[Documentation](README.md)** / **Installation & Maintenance**
>
> 🧭 **Navigation:** [Getting Started](Getting-Started.md) · [Installation](Installation-and-Maintenance.md) · [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Settings](Settings-and-API-Key.md) · [Architecture](Architecture.md) · [All Docs](README.md)

---

# Installation & Maintenance

NH Reader uses **native Tauri packaging** (`tauri build`) for local builds. There is no automated packaging workflow, and the project will not publish release assets until properly signed releases are available. Build and sign packages locally using the commands in `package.json`.

## 📦 Distribution Formats

| Platform | Formats | Package Type | Distribution / Build Method |
| --- | --- | --- | --- |
| **Windows** | NSIS (`.exe`), WiX (`.msi`), Portable (`.zip`) | Installer / MSI / Standalone | Manual local build and signing |
| **macOS** | DMG (`.dmg`), App bundle (`.app`), Portable (`.zip`) | Disk Image / Bundle / Standalone | Manual local build and signing |
| **Linux** | Debian (`.deb`), AppImage (`.AppImage`), Portable (`.tar.gz`) | Native package / Self-contained / Archive | Manual local build and signing |
| **Android** | APK (`.apk`) | Sideloadable Android Package | Manual local build and signing |
| **iOS** | Xcode archive, IPA (`.ipa`) | iPhone / iPad | **Manual build and signing** via Tauri CLI / Xcode on macOS |

---

## 📦 Installing on Desktop

Install the package you built and signed locally. The project does not publish release assets.

### 📦 Windows

1. Build with `npm run tauri:build:release` and, when you want a signed installer, sign with `npm run sign`. Find the NSIS `.exe` or WiX `.msi` under `src-tauri/target/release/bundle/`.
2. Run the installer:
   - **NSIS Setup**: Supports both **Current User** (per-user, non-elevated) and **All Users** (per-machine, administrative) installation scopes, custom directory selection, and creates Desktop / Start Menu shortcuts.
   - **WiX MSI**: Standard enterprise-ready Windows Installer package with silent install capability (`msiexec /i ... /qn`).
3. Launch `NH Reader` from the Start Menu or Desktop shortcut.

### 📦 macOS

1. Build with `npm run tauri:build:release`, then sign the generated `.app` bundle with `npm run sign` (identity from `--identity` or `APPLE_SIGNING_IDENTITY`; notarization and stapling run automatically when `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD` and `APPLE_TEAM_ID` are set).
2. Open the DMG disk image and drag **NH Reader** into the **Applications** folder.
3. Launch from Launchpad or `/Applications`. *(Note: For ad-hoc unsigned builds on macOS, control-click the app and choose "Open" on first launch to approve Gatekeeper).*

### 📦 Linux

1. Build with `npm run tauri:build:release`, then sign the generated package with `npm run sign` (an armored detached `gpg` signature created next to the package and verified automatically).
2. For Debian/Ubuntu:
   ```bash
   sudo dpkg -i nh-reader_<version>_amd64.deb
   ```
3. For AppImage:
   ```bash
   chmod +x nh-reader_<version>_amd64.AppImage
   ./nh-reader_<version>_amd64.AppImage
   ```
### 🔨 Building Desktop from Source (Optional)

If you prefer building your own desktop packages from source:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Build commands**:
   ```bash
   # Windows (generates NSIS .exe and WiX .msi in src-tauri/target/release/bundle/)
   npm run tauri:build:release

   # macOS (generates .dmg and .app in src-tauri/target/release/bundle/)
   npm run tauri:build:release

   # Linux (generates .deb and .AppImage in src-tauri/target/release/bundle/)
   npm run tauri:build:release
   ```

---

## 📱 Mobile Platforms — Android & iOS (Manual Build Mandatory)

> [!NOTE]
> There is no automated packaging workflow. **All platform packages must be built and signed manually from source.**

> [!IMPORTANT]
> **Hardware Testing Notice**: Android, macOS, and iOS builds are community-supported and untested by the maintainer. iOS builds require macOS, Xcode, and valid Apple signing credentials.

### 🤖 Android (APK Manual Build & Sideloading)

To compile and install your own Android APK:

1. **Prerequisites**:
   - Android Studio with Android SDK Platform 34 and NDK installed.
   - Java JDK 17 (e.g. Temurin or OpenJDK).
   - Rust Android targets:
     ```bash
     rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
     ```
2. **Initialize Android Project**:
   ```bash
   npm run tauri:android:init
   ```
3. **Generate a Free Release Signing Keystore**:
   ```bash
   keytool -genkey -v -keystore src-tauri/gen/android/release.keystore -alias nh-reader -keyalg RSA -keysize 2048 -validity 10000 -storepass nhreader -keypass nhreader -dname "CN=HELIX Origin, OU=NH Reader, O=HELIX Origin, L=Tokyo, ST=Tokyo, C=JP"
   ```
4. **Compile the APK**:
   ```bash
   npm run tauri:android:build
   ```
   The output APK will be generated at:
   `src-tauri/gen/android/app/build/outputs/apk/universal/release/*.apk`
5. **Install on Device**:
   - Transfer the `.apk` file to your device and tap to install (grant "Install unknown apps" permission if prompted).
   - Or install directly via ADB:
     ```bash
     adb install src-tauri/gen/android/app/build/outputs/apk/universal/release/*.apk
     ```

---

### 🍎 iOS (Manual Build & Signing)

To compile and sign for iOS:

1. **Prerequisites**:
   - macOS computer with Xcode 15+ installed.
   - Rust iOS targets:
     ```bash
     rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
     ```
   - CocoaPods (`sudo gem install cocoapods`) or modern SPM.
2. **Initialize iOS Project**:
   ```bash
   npm run tauri:ios:init
   ```
3. **Build via CLI or Xcode**:
   - Via CLI:
     ```bash
     npm run tauri:ios:build
     ```
   - Or open the generated Xcode project:
     ```bash
     open src-tauri/gen/ios/nh-reader.xcodeproj
     ```
4. **Configure Signing**:
   - In Xcode, go to **Signing & Capabilities**.
   - Select your Apple Developer team, signing identity, and a provisioning profile for the app's bundle identifier.
5. **Deploy & Run**:
   - Select a connected iPhone or iPad in Xcode and click **Run**, or export the signed archive for distribution.

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
- **macOS**: Sign the generated app bundle with `npm run sign` (identity from `--identity` or `APPLE_SIGNING_IDENTITY`). Notarization and stapling run automatically when `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD` and `APPLE_TEAM_ID` are set.
- **Linux**: `npm run sign` creates an armored detached signature next to the package and verifies it; check it manually with `gpg --verify path/to/package.asc path/to/package`.
- **Android**: Generate your own protected keystore with `keytool -genkeypair -keystore src-tauri/gen/android/release.keystore -alias nh-reader -keyalg RSA -keysize 2048 -validity 10000`, then sign with `npm run sign -- path/to/app.apk` (defaults to that keystore and the `nh-reader` alias; override with `--ks`/`--ks-alias`). `apksigner` prompts for the keystore password, or set `ANDROID_KEYSTORE_PASSWORD`.
- **iOS**: Use `npm run sign -- --ios CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM=<team-id> CODE_SIGN_IDENTITY="Apple Distribution" PROVISIONING_PROFILE_SPECIFIER=<profile-name>` on macOS with Xcode, an Apple signing identity, and a valid provisioning profile.

The Windows helper can generate a self-signed certificate if no PFX is present. That signature does not establish a trusted publisher identity. The project does not provide a trusted signing certificate for release binaries.

---

- Related: [Getting Started](Getting-Started.md) · [Architecture](Architecture.md) · [Security](Security.md)

---

### 📚 Documentation Index
- **Core**: [Home](README.md) · [Getting Started](Getting-Started.md) · [Installation & Maintenance](Installation-and-Maintenance.md)
- **App Features**: [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Favorites & History](Favorites-and-History.md) · [Reader & Galleries](Reader-and-Galleries.md) · [Settings & API Key](Settings-and-API-Key.md) · [Localization](Localization.md)
- **Architecture & Development**: [Architecture](Architecture.md) · [Backend (Rust)](Backend-Rust.md) · [Frontend (SvelteKit)](Frontend-SvelteKit.md) · [Packaging & Bundling](Installer-Engine.md) · [Development & Contributing](Development-and-Contributing.md)
- **Reference**: [Security](Security.md) · [Privacy](Privacy.md) · [Troubleshooting](Troubleshooting.md) · [FAQ](FAQ.md)

---

*[NH Reader](https://github.com/HELIX-Origin/NH-Reader) — a lightweight, modern, cross-platform client for nhentai.net.*

*[Documentation Home](README.md) · [Repository](https://github.com/HELIX-Origin/NH-Reader) · [Releases](https://github.com/HELIX-Origin/NH-Reader/releases) · [Security](Security.md) · [Privacy](Privacy.md) · [TOS](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md) · [License](https://github.com/HELIX-Origin/NH-Reader/blob/main/LICENSE.md)*
