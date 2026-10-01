# NH Reader v0.6.0

**Release date:** 2026-10-01

## ✨ Highlights

NH Reader v0.6.0 is a major milestone delivering a completely rebuilt native installer engine, an all-new Library tab with offline archive reading, official API archive downloads, an account authentication modal, Mihon-style floating navigation, squircle design, and seamless process lifecycle handling. This release rebrands the client to **NH Reader** and decouples runtime persistence into an isolated SQLite database (`database.sqlite`).

## 🚀 Key Improvements & Features

- **Rebuilt native installer engine** — Replaced custom webview installer routes and bespoke build scripts with Tauri 2's native packaging toolchain (`tauri build`) augmented with a custom NSIS template (`src-tauri/windows/hooks.nsh`). Provides:
  - Both per-user (`%LOCALAPPDATA%`) and per-machine (`Program Files`) installation scopes.
  - Enterprise-ready WiX MSI installer (`.msi`).
  - Standard Windows Uninstaller registered cleanly in "Installed apps" / "Add or remove programs" with clean binary and shortcut removal.
  - Self-contained portable mode via `.portable` marker or local `data/` directory.
  - Free code-signing pipeline (`scripts/sign.ps1` / `npm run sign:windows`).
- **Dedicated Library & offline archive reading** — Added a dedicated `/library` bottom navigation tab organizing downloaded doujins, downloaded favorites, and reading history:
  - Interactive downloaded doujins shelf (`DownloadedView.svelte`) displaying covers, metadata, page counts, file formats (`ZIP`/`CBZ`), and direct reading actions.
  - Native zip/cbz archive parser and extractor commands streaming page bytes directly from local disk.
  - 100% offline reading support in `ReaderImage.svelte` without requiring an internet connection.
  - Decoupled Library favorites view that isolates downloaded favorites from global online favorites.
- **Official API archive downloads** — Updated the background download engine to utilize nhentai API v2's dedicated archive endpoint (`POST /api/v2/galleries/{id}/download`), downloading complete pre-packaged `.zip` and `.cbz` archives directly with smooth real-time byte progress.
- **Dedicated Account Login modal** — Added a modern dual-mode authentication modal (`LoginModal.svelte`):
  - Official API Key sign-in (recommended, bypasses Cloudflare CAPTCHAs).
  - Direct credentials authentication (`POST /api/v2/auth/login`).
  - Reactive profile status rendering username and avatar immediately upon connecting.
  - Strict account profile and blacklist tag isolation.
- **Mihon-style floating bottom navigation & squircle styling** — Elevated bottom navigation into a floating pill with backdrop blur (`rgba(31,31,31,0.92)`), elevation shadow, and safe bottom content padding. Softened overly sharp corner radiuses across cards, navigation pills, and tabs to small squircle corners (8px - 10px).
- **Native OS window titlebar & in-app top bar** — Restored native system window decorations (`decorations: true`), paired with a non-interactive dragging header in the in-app top bar.
- **Clean window exit & process shutdown** — Eliminated premature Win32 `window.destroy()` calls and removed close event cancellation, allowing WebView2 to gracefully unregister `Chrome_WidgetWin_0` without Error 1411 and terminating cleanly without hanging processes.
- **Dynamic UI scaling** — Configurable row-fitting grid layout that dynamically calculates container columns and visible cards, eliminating trailing gaps or orphaned empty card spaces.

## ✅ Changed

- Rebranded product name to **NH Reader** (`NH Reader.exe`, window title "NH Reader", package `nh-reader`, identifier `net.nh-reader.client`).
- Decoupled persistence to ambiguous `database.sqlite` with automatic schema and key prefix migration.
- Bumped project version to `0.6.0` across `package.json`, `Cargo.toml`, `tauri.conf.json`, `Cargo.lock`, and documentation.
- Documented across documentation and wiki that because the maintainer lacks physical macOS and Android devices, iOS and Android (as well as macOS) builds are currently community-supported and untested by the author.
- Synchronized all tracking ledgers and documentation (`ROADMAP.md`, `TODO.md`, `BUGS.md`, `README.md`, `CHANGELOG.md`, and all `wiki/` pages).

## 🐛 Fixed

- **Window exit hang & WebView2 unregister error (1411)** — Fixed process shutdown sequence to exit gracefully via `app.exit(0)`, resolving WebView2 unregister class failures and preventing SIGINT (`0xc000013a`) terminations.
- **Avatar URL resolution** — Fixed parsing for protocol-relative (`//static.nhentai.net/...`) avatar paths and added fallback to user initial placeholder.
- **Download file lock collision** — Flushed and closed file handles before renaming temporary files to final archives on Windows.
- **Account blacklist sync** — Resolved numeric tag IDs for `POST /api/v2/blacklist`, preventing corrupt profile or `favorite_tags` overwrites.
- **Dialog transparency & clipping** — Established solid opaque dark-surface backgrounds (`#1f1f1f` / `#252525`) for account modal dialogs.

## 📦 Install & Upgrading

Download the installer or package for your platform from the Assets section below:

- Windows (NSIS Setup): `NH Reader_0.6.0_x64-setup.exe`
- Windows (WiX MSI): `NH Reader_0.6.0_x64_en-US.msi`
- Windows (Portable ZIP): `NHReaderPortable_0.6.0.zip`
- macOS (DMG): `NH Reader_0.6.0_x64.dmg` (or `aarch64` for Apple Silicon)
- Linux (Debian): `nh-reader_0.6.0_amd64.deb`
- Linux (AppImage): `nh-reader_0.6.0_amd64.AppImage`
- Android (APK): `nh-reader_0.6.0_universal.apk` *(community-supported / untested)*
- iOS (IPA): `nh-reader_0.6.0.ipa` *(Apple Silicon macOS sideloading & iOS; community-supported / untested)*

Upgrade in place: run the new installer over your existing installation. Your SQLite database (`database.sqlite`), favorites, reading history, downloaded archives, and settings carry over automatically.

## Verification

- `cargo check` + `cargo test` (src-tauri) — passed (7/7)
- `npm run check` (svelte-check) — 0 errors, 0 warnings
- `npm run i18n:check` — 258/258 keys validated
- `npm run check:agents` — 51/51 files compliant, 0 violations

## 📄 Changes & Commits

- `ci(workflow): isolate matrix runner build commands and package paths for all platforms`
- `c827d15` `ci(workflow): separate packaging into dedicated desktop, android, and ios jobs`
- `e86642f` `ci(workflow): add Android and iOS runners to packaging matrix`
- `7e13fad` `docs(templates): restore canonical release notes template format`
- `e384975` `docs(release): format release notes to standard`
- `454a8dd` `chore(release): bump version to 0.6.0`
- `1fb18c0` `docs(plan): add research for native installer visual customization to BUGS.md and TODO.md`
- `791e641` `docs(plan): record decision to revert to native tauri packaging in BUGS.md and TODO.md`
- `90f1106` `fix(installer): address production CSP, prerendered installer.html, and working directory; record native packaging fallback`
- `855d462` `docs(bugs): clarify restoring default packaging is a potential starting point`
- `71da891` `docs(bugs): note restoration of default tauri nsis/msi packaging as fix in issue #4`
- `2260f6b` `fix(installer): do not emit loose uninstaller into release assets; docs(bugs): record breaking blank screen bug`
- `06ff66c` `docs(release): link v0.5.0 release and mark M8 release tasks completed in ROADMAP and TODO`

Full commit history: `git log --oneline v0.5.0..v0.6.0`
