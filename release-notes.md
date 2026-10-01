# NH Reader v0.6.1

**Release date:** 2026-10-01

## ✨ Highlights

NH Reader v0.6.1 is a targeted stability and polish release addressing installer branding, text legibility, CI workflow reliability, and providing standalone zero-install portable archives across all supported desktop platforms (Windows, macOS, and Linux).

## 🚀 Key Improvements & Features

- **Multi-Platform Portable Packages (Windows, macOS, Linux)** — Portable execution is now supported across all desktop targets with `.portable` runtime markers:
  - **Windows**: `NHReaderPortable_Windows_x64.zip` (portable executable + isolated data folder).
  - **Linux**: `nh-reader_portable_linux_x86_64.tar.gz` (standalone compiled binary with zero package manager dependencies).
  - **macOS**: `NHReaderPortable_macOS.zip` (portable `.app` bundle with internal isolated runtime marker).
- **Official App Icon Installer Branding** — Replaced glowing placeholder circles with crisp, high-resolution bitmap assets (`header.bmp` [150×57] and `sidebar.bmp` [164×314]) generated directly from the official `icon.png` application branding on an exact-matching dark background.
- **NSIS Text Legibility & Dark Theme Polish** — Removed conflicting color defines from `src-tauri/windows/hooks.nsh` that caused white-on-white and white-on-gray unreadable dialog text, ensuring all labels, group boxes, and installation directory controls render with high contrast while retaining Windows DWM immersive dark window title bar styling.
- **CI / Packaging Workflow Stabilization**:
  - Rebuilt the GitHub Actions release matrix to strictly isolate each platform runner to its own artifacts, eliminating runner crosstalk and false-positive completions.
  - Enforced strict failure policies (`if-no-files-found: error`, `fail_on_unmatched_files: true`).
  - Added pinned Android NDK (`27.2.12479018`) setup via `sdkmanager` exporting `NDK_HOME` to `$GITHUB_ENV` for deterministic APK builds.
  - Dropped iOS packaging runner from CI until manual Apple Developer team credentials can be configured.

## 📦 Install & Upgrading

Download the installer or package for your platform from the Assets section below:

- Windows (NSIS Setup): `NH Reader_0.6.1_x64-setup.exe`
- Windows (WiX MSI): `NH Reader_0.6.1_x64_en-US.msi`
- Windows (Portable ZIP): `NHReaderPortable_Windows_x64.zip`
- Linux (Debian): `nh-reader_0.6.1_amd64.deb`
- Linux (AppImage): `nh-reader_0.6.1_amd64.AppImage`
- Linux (Portable Archive): `nh-reader_portable_linux_x86_64.tar.gz`
- macOS (DMG): `NH Reader_0.6.1_x64.dmg` (or `aarch64` for Apple Silicon)
- macOS (Portable ZIP): `NHReaderPortable_macOS.zip`
- Android (APK): `nh-reader_0.6.1_universal.apk` *(community-supported / untested)*

Upgrade in place: run the new installer over your existing installation. Your SQLite database (`database.sqlite`), favorites, reading history, downloaded archives, and settings carry over automatically.
