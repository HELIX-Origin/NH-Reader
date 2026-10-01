# Packaging & Installer Architecture

NH Reader utilizes **Tauri v2 Native Packaging** (`tauri build`) to produce reliable, signed, and fully bundled distributions for Windows, macOS, Linux, Android, and iOS.

## 🧭 Why Native Packaging Over Custom Installers

In earlier versions, a custom embedded installer was evaluated. However, custom installers in Tauri v2 present significant architectural challenges:
1. **Asset & Webview Bundling**: Native packaging automatically links and bundles frontend static assets, webview loaders, and platform runtime dependencies into the output binary package.
2. **Elevation & UAC**: Windows User Account Control (UAC) handling during custom installs often causes file-locking collisions and permission errors when updating program files.
3. **Uninstallation & System Registry**: Native installers (NSIS and WiX) manage system uninstaller registrations, start menu entries, and desktop shortcuts cleanly through standard OS facilities.
4. **Mobile & Cross-Platform Alignment**: Tauri's native packaging toolchain cleanly supports mobile APK and iOS packaging alongside desktop installers.

---

## 📦 Bundling Pipeline

```mermaid
flowchart TD
    A[npm run build:app / tauri build] --> B[SvelteKit build static]
    B --> C[Rust cargo build release]
    C --> D{Platform Bundler}
    D -->|Windows| E[NSIS setup.exe]
    D -->|Windows| F[WiX .msi]
    D -->|macOS| G[DMG & .app bundle]
    D -->|Linux| H[deb & AppImage]
    D -->|Android| I[APK & AAB]
    D -->|iOS| J[IPA bundle]
```

### Build Commands

```bash
# Desktop release build (bundles NSIS, WiX MSI, DMG, or deb/AppImage)
npm run build:app

# Debug desktop build (unoptimized, useful for rapid testing)
npm run build:app:debug

# Mobile build pipelines
npm run mobile:android:init    # initialize Android studio project
npm run mobile:android:build   # compile standalone APK
npm run mobile:ios:init        # initialize Xcode project
npm run mobile:ios:build       # compile iOS archive / sideload bundle
```

---

## ⚙️ Configuration (`src-tauri/tauri.conf.json`)

Packaging is configured under the `bundle` key in `src-tauri/tauri.conf.json`:

```json
"bundle": {
  "active": true,
  "targets": "all",
  "icon": [
    "icons/32x32.png",
    "icons/128x128.png",
    "icons/128x128@2x.png",
    "icons/icon.icns",
    "icons/icon.ico"
  ],
  "windows": {
    "certificateThumbprint": null,
    "digestAlgorithm": "sha256",
    "timestampUrl": "",
    "nsis": {
      "installMode": "both",
      "installerIcon": "icons/icon.ico",
      "headerImage": null,
      "sidebarImage": null,
      "languages": ["English"]
    },
    "wix": {
      "language": "en-US"
    }
  },
  "macOS": {
    "dmg": {
      "windowSize": { "width": 600, "height": 400 },
      "appPosition": { "x": 180, "y": 170 },
      "applicationFolderPosition": { "x": 420, "y": 170 }
    }
  }
}
```

---

## 🎨 Customizing NSIS & WiX Installers

Tauri v2 allows deep customization of Windows installers without breaking native stability:

1. **NSIS Installation Mode (`installMode: "both"`)**:
   - Gives the user a choice between "Install for anyone who uses this computer (all users)" or "Install just for me (current user)".
2. **Visual Assets**:
   - `headerImage`: 150x57 BMP header graphic displayed during installation.
   - `sidebarImage`: 164x314 BMP graphic displayed on the Welcome and Finish wizard pages.
3. **Custom NSIS Hooks (`customLanguageFiles`, custom `.nsh` includes)**:
   - For custom registry entries, environment variables, or custom styling.
4. **WiX Templates**:
   - For corporate deployment, custom `.wxs` fragments can be injected into the WiX MSI compilation.

---

- Related: [Installation & Maintenance](Installation-and-Maintenance) · [Architecture](Architecture) · [Security](Security)