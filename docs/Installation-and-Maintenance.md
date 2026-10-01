<div align="right">
  <label for="translate-select" style="font-size:12px; color:#a1a1aa; margin-right:6px;">🌐 Language:</label>
  <select id="translate-select" style="background:#18181b; color:#f4f4f5; border:1px solid #3f3f46; border-radius:6px; padding:4px 8px; font-size:12px; cursor:pointer;" onchange="translatePage(this.value)">
    <option value="en">English</option>
    <option value="ja">日本語 (Japanese)</option>
    <option value="zh-CN">简体中文 (Simplified Chinese)</option>
    <option value="zh-TW">繁體中文 (Traditional Chinese)</option>
    <option value="ko">한국어 (Korean)</option>
    <option value="es">Español (Spanish)</option>
    <option value="fr">Français (French)</option>
    <option value="de">Deutsch (German)</option>
    <option value="ru">Русский (Russian)</option>
    <option value="pt">Português (Portuguese)</option>
    <option value="it">Italiano (Italian)</option>
    <option value="th">ไทย (Thai)</option>
    <option value="vi">Tiếng Việt (Vietnamese)</option>
    <option value="id">Bahasa Indonesia (Indonesian)</option>
    <option value="pl">Polski (Polish)</option>
    <option value="nl">Nederlands (Dutch)</option>
    <option value="tr">Türkçe (Turkish)</option>
    <option value="ar">العربية (Arabic)</option>
  </select>
  <div id="google_translate_element" style="display:none;"></div>
</div>
<script type="text/javascript" src="./translate.js"></script>

---

> **[Documentation](README.md)** / **Installation & Maintenance**
>
> 🧭 **Navigation:** [Getting Started](Getting-Started.md) · [Installation](Installation-and-Maintenance.md) · [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Settings](Settings-and-API-Key.md) · [Architecture](Architecture.md) · [All Docs](README.md)

---

# Installation & Maintenance

NH Reader ships via **native Tauri packaging** (`tauri build`), providing rock-solid platform-native installers across Windows, macOS, and Linux with full dependency and resource bundling, alongside manual build tooling for Android and iOS.

## 📦 Distribution Formats

| Platform | Formats | Package Type | Distribution / Build Method |
| --- | --- | --- | --- |
| **Windows** | NSIS (`.exe`), WiX (`.msi`), Portable (`.zip`) | Installer / MSI / Standalone | Automated Release Asset (or optional manual build) |
| **macOS** | DMG (`.dmg`), App bundle (`.app`), Portable (`.zip`) | Disk Image / Bundle / Standalone | Automated Release Asset (or optional manual build) |
| **Linux** | Debian (`.deb`), AppImage (`.AppImage`), Portable (`.tar.gz`) | Native package / Self-contained / Archive | Automated Release Asset (or optional manual build) |
| **Android** | APK (`.apk`) | Sideloadable Android Package | **Mandatory manual build** via local CLI |
| **iOS** | IPA (`.ipa`), Xcode archive | Sideloadable iOS / Apple Silicon | **Mandatory manual build** via local CLI / Xcode |

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
### 🔨 Building Desktop from Source (Optional)

If you prefer building your own desktop packages from source:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Build commands**:
   ```bash
   # Windows (generates NSIS .exe and WiX .msi in src-tauri/target/release/bundle/)
   npm run build:app

   # macOS (generates .dmg and .app in src-tauri/target/release/bundle/)
   npm run build:app

   # Linux (generates .deb and .AppImage in src-tauri/target/release/bundle/)
   npm run build:app
   ```

---

## 📱 Mobile Platforms — Android & iOS (Manual Build Mandatory)

> [!NOTE]
> Automated CI releases exclusively package desktop targets (Windows, macOS, Linux). **Mobile packages (Android & iOS) are not built by CI workflows and must be built manually from source.**

> [!IMPORTANT]
> **Hardware Testing Notice**: The maintainer does not possess physical Android or macOS/iOS test hardware. Mobile toolchains are fully supported through Tauri 2, but builds are community-supported and untested by the maintainer.

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
   npm run mobile:android:init
   ```
3. **Generate a Free Release Signing Keystore**:
   ```bash
   keytool -genkey -v -keystore src-tauri/gen/android/release.keystore -alias nh-reader -keyalg RSA -keysize 2048 -validity 10000 -storepass nhreader -keypass nhreader -dname "CN=HELIX Origin, OU=NH Reader, O=HELIX Origin, L=Tokyo, ST=Tokyo, C=JP"
   ```
4. **Compile the APK**:
   ```bash
   npm run mobile:android:build
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

### 🍎 iOS & Apple Silicon macOS (Manual Build & Sideloading)

To compile for iOS or Apple Silicon macOS:

1. **Prerequisites**:
   - macOS computer with Xcode 15+ installed.
   - Rust iOS targets:
     ```bash
     rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
     ```
   - CocoaPods (`sudo gem install cocoapods`) or modern SPM.
2. **Initialize iOS Project**:
   ```bash
   npm run mobile:ios:init
   ```
3. **Build via CLI or Xcode**:
   - Via CLI:
     ```bash
     npm run mobile:ios:build
     ```
   - Or open the generated Xcode project:
     ```bash
     open src-tauri/gen/ios/nh-reader.xcodeproj
     ```
4. **Configure Personal Signing (Free)**:
   - In Xcode, go to **Signing & Capabilities**.
   - Under **Team**, select your free Personal Apple ID (no paid developer subscription required).
5. **Deploy & Run**:
   - **Apple Silicon Mac**: Run directly as a native desktop application without needing jailbreaks or developer certificates.
   - **Physical iPhone / iPad**: Select your connected iOS device in Xcode and click **Run**, or export the unsigned archive and sideload via AltStore, SideStore, Sideloadly, or TrollStore.

> [!CAUTION]
> **Mandatory Jailbreak Disclaimer**
> 
> NH Reader provides native iOS packaging capabilities for Apple Silicon macOS usage and personal ad-hoc sideloading. **No technical support, customer assistance, or warranty is provided for users who brick, damage, crash, or compromise their devices by attempting to jailbreak their phones.** Sideloading or jailbreaking is undertaken entirely at your own risk.

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

- Related: [Getting Started](Getting-Started.md) · [Architecture](Architecture.md) · [Security](Security.md)

---

### 📚 Documentation Index
- **Core**: [Home](README.md) · [Getting Started](Getting-Started.md) · [Installation & Maintenance](Installation-and-Maintenance.md)
- **App Features**: [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Favorites & History](Favorites-and-History.md) · [Reader & Galleries](Reader-and-Galleries.md) · [Settings & API Key](Settings-and-API-Key.md) · [Localization](Localization.md)
- **Architecture & Development**: [Architecture](Architecture.md) · [Backend (Rust)](Backend-Rust.md) · [Frontend (SvelteKit)](Frontend-SvelteKit.md) · [Packaging & Bundling](Installer-Engine.md) · [Development & Contributing](Development-and-Contributing.md)
- **Reference**: [Security](Security.md) · [Privacy](Privacy.md) · [Troubleshooting](Troubleshooting.md) · [FAQ](FAQ.md)

---

*[NH Reader](https://github.com/HELIX-Origin/NH-Reader) — a lightweight, modern, cross-platform client for nhentai.net.*

*[Documentation Home](README.md) · [Repository](https://github.com/HELIX-Origin/NH-Reader) · [Releases](https://github.com/HELIX-Origin/NH-Reader/releases) · [Security](Security.md) · [Privacy](Privacy.md) · [TOS](../TOS.md) · [License](../LICENSE.md)*
