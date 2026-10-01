# TODO.md

> Actionable task ledger. Statuses: ⬜ backlog · 🚧 in progress · ✅ done.
> High-level direction lives in `ROADMAP.md`; role and workflow definitions live in
> `.agents/` (see `.agents/ROLES.md`).
>
> When a task changes behavior or scope, update this file **in the same change**.
> When a task is done, move it to the bottom under **Done** and link the PR/commit if any.

## 🎯 Active Milestone: v0.7.1 — CI Workflow Patch

> Patch release to fix the broken Android CI packaging job pushed in v0.7.0.
> This is a CI-infrastructure-only patch — no app code changes.
> **Nothing in this milestone may be pushed until it has been verified end-to-end
> in dry-run mode (`dry_run: true`).** This is a hard requirement from the user.

### 📌 v0.7.1 Tasks:

- ✅ **Step 1: Research Android build failure root cause**:
  - Read full `package-android` job logs: identified invalid `--target aarch64,armv7,x86_64` value which requires repeated `--target` arguments.
- ✅ **Step 2: Migrate `actions/setup-java@v4` → `@v5`**:
  - Updated `package-android` job in `.github/workflows/package.yml`.
- ✅ **Step 3: Fix Android build command & environment**:
  - Corrected `--target` flags to `--target aarch64 --target armv7 --target x86_64` and prefixed `_window`/`_event` in `on_window_event`.
- ✅ **Step 4: Dry-run validation (`dry_run: true`) & recovery mode**:
  - Added `release_tag` workflow input and verified workflow dry runs.
- ✅ **Step 5: Release v0.7.1**:
  - Bumped version to `0.7.1` across `package.json`, `Cargo.toml`, `tauri.conf.json`.
  - Finalized `CHANGELOG.md` and prepared `scratch/release-notes.md`.
  - Seeded all GitHub discussions (announcements v0.1.0-v0.7.1, General, Ideas, Q&A, Show & Tell).


### ✅ Completed Milestone Tasks (v0.7.0):
- ✅ **Step 1: Multi-Platform Portable Packages (Windows, macOS, Linux)**:
  - Added standalone platform-native portable archives (`NHReaderPortable_Windows_x64.zip`, `nh-reader_portable_linux_x86_64.tar.gz`, `NHReaderPortable_macOS.zip`) sharing root `.portable` marker and isolated `./data/` folder.
  - Added ancestor traversal in `src-tauri/src/lib.rs` (`detect_portable_dir`) so `.portable` and `./data/` are resolved inside or outside `.app` bundles and desktop folders.
- ✅ **Step 2: Universal Portable Launcher Scripts**:
  - Added standalone launcher scripts `scripts/launch-linux.sh`, `scripts/launch-macos.command`, and `scripts/launch-windows.bat`.
- ✅ **Step 3: NSIS Coordinated Contrast & Dark Theme Alignment**:
  - Configured `MUI_BGCOLOR "18181B"`, `MUI_TEXTCOLOR "F4F4F5"`, `MUI_HEADER_BGCOLOR "0D0D0D"`, `MUI_HEADER_TEXTCOLOR "FFFFFF"`, `MUI_HEADER_TRANSPARENT_TEXT`, and `MUI_INSTFILESPAGE_COLORS "F4F4F5 18181B"` in `src-tauri/windows/hooks.nsh` to eliminate black-on-dark unreadable text while aligning text contrast cleanly for both light and dark page sections.
- ✅ **Step 4: Installer Bitmaps Generation from Official App Icon**:
  - Generated crisp assets directly from `src-tauri/icons/icon.png` with exact `#0d0d0d` background (`header.bmp` [150×57] and `sidebar.bmp` [164×314]) via `scripts/generate-installer-bitmaps.ps1`.
- ✅ **Step 5: Restore Full Mobile Toolchain (Android & iOS — Excluded from CI Workflow)**:
  - Restored iOS scripts (`mobile:ios:init`, `mobile:ios:build`) in `package.json` alongside Android tooling (`mobile:android:*`) to support building mobile packages locally via Tauri CLI.
  - Restored mobile settings section and jailbreak disclaimer in `SettingsView.svelte` and `en.json`.
  - Added step-by-step manual build instructions for Android (APK) and iOS (Xcode/sideloading) in documentation.
  - Excluded mobile targets from the automated GitHub Actions release workflow (`package.yml`), keeping CI strictly dedicated to desktop targets (Windows, Linux, macOS).
- ✅ **Step 6: CI & Packaging Workflow Stabilization, Android Split ABIs & True Dry Run Mode**:
  - Rebuilt `.github/workflows/package.yml` matrix so each runner strictly builds and searches for its own platform artifacts, preventing false-positive uploads and runner crosstalk.
  - Decoupled release publishing from build runners into a dedicated downstream `publish-release` job, eliminating race conditions on release creation and ensuring that failed builds never produce partial releases.
  - Added dedicated `package-android` job to `.github/workflows/package.yml` building separate APK files for each supported Android architecture (`aarch64` / arm64-v8a, `armv7` / armeabi-v7a, `x86_64`) via `--apk --split-per-abi`, excluding universal APKs to minimize file size.
  - Configured dynamic detection of runner pre-installed Android NDK versions without brittle manual sdkmanager re-downloads.
  - Added true dry-run mode via `workflow_dispatch` input (`dry_run: true`): builds and validates all desktop and Android packages, generates workflow run artifacts, and runs a dedicated verification job without publishing release assets to non-existent releases.
  - Added optional draft pre-release support (`create_test_release: true`) during dry runs to safely test the complete release asset publication pipeline without public visibility.
  - Upgraded packaging workflow to Node.js 26 (`actions/setup-node@v4`), matching local development runtime (`v26.8.1`).
- ✅ **Step 7: Per-Platform Tauri Configuration Files (`tauri.<platform>.conf.json`)**:
  - Created `src-tauri/tauri.windows.conf.json` with dedicated Windows icon manifest (`icon.ico`, `32x32.png`, `128x128.png`, and `Square*Logo.png` / `StoreLogo.png`).
  - Created `src-tauri/tauri.linux.conf.json` with Linux icon sizes (`32x32.png`, `64x64.png`, `128x128.png`, `128x128@2x.png`, `icon.png`).
  - Created `src-tauri/tauri.macos.conf.json` with macOS icon formats (`icon.icns`, `128x128.png`, `128x128@2x.png`).
  - Created `src-tauri/tauri.android.conf.json` and `src-tauri/tauri.ios.conf.json` for mobile platform parameters.
  - Updated base `src-tauri/tauri.conf.json` icon list with `64x64.png` and `icon.png`.
- ✅ **Step 8: NSIS Multi-Language Configuration & Selector**:
  - In `src-tauri/tauri.conf.json`, enabled `"displayLanguageSelector": true` under `windows.nsis` and registered core installer languages (`English`, `Japanese`, `SimpChinese`, `TradChinese`, `Korean`, `Spanish`, `French`, `German`, `Russian`, `Portuguese`).
- ✅ **Step 9: Complete All 17 Language Packs (100% Key Parity Across All 276 Keys)**:
  - Authored full hand-rolled drop-in translations for all languages: `ar`, `de`, `es`, `fr`, `id`, `it`, `ja`, `ko`, `nl`, `pl`, `pt`, `ru`, `th`, `tr`, `vi`, `zh-CN`, and `zh-TW`.
  - Every single pack provides 276/276 keys, fully validated with `npm run i18n:check` (0 missing, 0 untranslated, 0 extra).
- ✅ **Step 10: Per-Locale Date and Number Formatting**:
  - Enhanced `src/lib/format.ts` (`formatCount`, `formatDate`, `relativeDate`, `formatBytes`) to use standard browser `Intl.NumberFormat`, `Intl.DateTimeFormat`, and `Intl.RelativeTimeFormat`, reactively linked to `locale.value`.
- ✅ **Step 11: Migration from GitHub Wiki to In-Repo `docs/` with Live Translation**:
  - Moved all documentation from `wiki/` into repository `docs/` folder, converting `Home.md` into `docs/README.md`.
  - Added interactive Google Translate widget and button with custom JS script (`docs/translate.js`) at the top-right of all markdown files (later replaced by a GitHub-safe `<details>` dropdown plus an in-place `<select>` on GitHub Pages).
  - Replaced `_Sidebar.md` and `_Footer.md` with responsive in-page navigation breadcrumbs, documentation index, and footer.
  - Updated all internal and cross-document links to use concrete relative paths and explicit `.md` file extensions.
  - Removed obsolete `.github/workflows/wiki.yml` sync workflow.
- ✅ **Step 12: GitHub Discussions Release Announcements & Template**:
  - Seeded detailed release announcements for all historical versions (`v0.1.0` through `v0.6.0`) in `.github/discussions/announcements/` and indexed in `.github/discussions/announcements.md`.
  - Standardized the release announcement structure using `.agents/templates/release-announcement.md` based on the v0.6.0 announcement format.
  - Updated release standards across `.agents/rules/release.md`, `.agents/skills/cut-release.md`, and agent role contracts.
- ✅ **Step 13: Reader Preload Distance & Image Quality Selector**:
  - Implemented configurable reader preload buffer (`1`, `2`, `3`, `5` pages) dynamically sizing reader slice buffering.
  - Implemented image quality selector (`high` / Original vs `low` / Data Saver preview thumbnails from `THUMB_HOST`).
  - Added quick quality cycle button (`Q` hotkey) to the reader toolbar and full controls in Settings.
  - Added localized strings across all 18 supported languages with 100% key parity (276/276 keys).
- ✅ **Step 14: Custom Framed Title Bar, Per-OS Window Controls & System Tray Restore**:
  - Disabled OS window decorations in `src-tauri/tauri.conf.json` (`"decorations": false`) for an integrated custom title bar.
  - Built dedicated `WindowControls.svelte` supporting per-OS glyphs: native macOS traffic lights on the left revealing inner glyphs on hover, and Windows/Linux shrunken squircle-framed controls (24×22px, 5px squircle radius) with line, square/stacked, and X glyphs. Highlight effects respect custom Linux desktop themes.
  - Added configurable `windowControlsPosition` setting (`Auto`, `Left`, `Right`) under Appearance settings in `SettingsView.svelte` for Linux and custom desktop environments.
  - Added window drag regions, title bar double-click maximize/restore toggle, and reactive window state synchronization.
  - Added `core:window:allow-is-maximized` permission to `src-tauri/capabilities/default.json`.
- ✅ **Step 15: Arabic RTL Layout Polish (M9.2 RTL Phase)**:
  - Added `isRTL` and `dir` getters to `locale.svelte.ts` reactively bound to `document.documentElement.dir`, `document.documentElement.lang`, and `<div class="app" dir={locale.dir}>`.
  - Added Arabic typography font fallbacks (`'Segoe UI Arabic'`, `'Noto Sans Arabic'`, `'Tahoma'`) in `tokens.css` and 1.6 line height for Arabic text rendering.
  - Implemented RTL-aware layout polish in `app.css`: right-aligned search inputs, mirrored drawer panel sliding from the left (`nh-drawer-slide-rtl`), mirrored toggle switch knobs, flipped back navigation icons, and corrected badge margins.
- ✅ **Step 16: CBZ Direct Export from Reader Toolbar**:
  - Implemented direct CBZ export button in reader toolbar (`src/routes/gallery/[id]/reader/+page.svelte`) triggering background download worker via `enqueueDownload(id, 'cbz')`.
  - Added live progress percentage, checkmark indicator when completed, and `E` keyboard shortcut.
  - Added localized strings across all 18 supported languages with 100% key parity (279/279 keys verified via `npm run i18n:check`).

## ✅ Done — Completed Milestones & Historical Releases

- ✅ **NH Reader GitHub Pages project and documentation site**: Added a vCard-inspired landing page with a directory of the existing, interlinked multi-page documentation in `docs/` published at `https://helix-origin.github.io/NH-Reader/` by the `GitHub Pages` workflow (`.github/workflows/pages.yml`). The desktop application's SPA is not deployed as a website.
- ✅ **Pages documentation navigation & working translate dropdowns**: Data-driven sidebar, previous/next links and project-page directory (`docs/_data/navigation.yml`); every Markdown page now ships a GitHub-renderable `<details>` language dropdown, and Pages pages get a real in-place Google Translate `<select>` (`docs/translate.js`).
- ✅ **Automatic Pages deployment & in-place translation for root Markdown**: `.github/workflows/pages.yml` builds, enables (via `PAGES_ADMIN_TOKEN`) and deploys the site; `scripts/build-pages.mjs` publishes `README`, `CONTRIBUTING`, `SECURITY`, `PRIVACY` and `TOS` under `repo/` so their translate dropdowns translate in place.

### [v0.6.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.6.0) — Upstream Alignment, Dedicated Library Hub & Rebuilt Native Installer (2026-10-01)
- ✅ **Rebuilt Native Packaging with Custom NSIS Hook Template**:
  - Migrated from custom webview installer to Tauri 2 native packaging augmented with `src-tauri/windows/hooks.nsh`.
  - Added dual installation scopes (per-user AppData and per-machine Program Files) with automatic uninstaller registration in Windows Installed Apps.
  - Built enterprise WiX `.msi` installers and added PowerShell code signing script (`scripts/sign.ps1`, `npm run sign:windows`).
- ✅ **Primary Library Navigation Tab & Downloaded Doujins Shelf**:
  - Added `/library` bottom navigation item with `book` icon serving as the central offline reading hub.
  - Implemented `get_downloaded_galleries`, `get_downloaded_gallery_page`, `get_downloaded_gallery_info`, `has_downloaded_gallery`, and `delete_downloaded_gallery` in `commands.rs`.
  - Direct reading from downloaded `.zip`/`.cbz` archives in `ReaderImage.svelte` without network requests.
- ✅ **Library Downloaded Favorites Isolation (Track 9)**:
  - Scoped the Library's "Favorites" tab (`FavoritesView.svelte` with `downloadedOnly={true}`) to exclusively display downloaded favorites (`isDownloaded(id)`), decoupling it from the standalone `/favorites` tab.
- ✅ **Official Archive Downloads via Upstream API**:
  - Adopted `POST /api/v2/galleries/{id}/download` endpoint, eliminating page-by-page CDN crawling when authenticated.
- ✅ **Dedicated Account Login & Authentication Modal**:
  - Implemented `LoginModal.svelte` with dual tabs: API Key (recommended, bypasses Cloudflare CAPTCHAs) and direct credentials.
  - Wired reactive account state getters in `account.svelte.ts` for immediate avatar/username rendering.
- ✅ **Mihon-Style Floating Bottom Navigation**:
  - Floating pill navigation bar with squircle corners, backdrop blur, elevation shadow, and safe bottom content padding.
- ✅ **Cache Management & Storage Optimization (Track 3)**:
  - Configurable storage budgets (500 MB to Unlimited) in settings.
  - Automatic background LRU image cache pruning in `image_cache.rs` and `service.rs`.
  - SQLite `VACUUM` compaction and isolated API response cache purging.
- ✅ **Dynamic UI Scaling & Zero-Empty-Card Layout**:
  - Implemented dynamic column calculation based on container width and full-row fitting in `GalleryGrid.svelte`, eliminating empty card gaps.
- ✅ **Closed Tracking Issues**:
  - Closed Issue #4 (Resource Packaging), Issue #5 (Full UI Localization), Issue #6 (Downloads & Library Polish), Issue #7 (Cache Management & Storage), Issue #8 (UI Consistency Audit), and Issue #9 (Mobile Support).

### [v0.5.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.5.0) — Installation Destination Scopes & Portable Mode (2026-09-30)
- ✅ **Installation Scopes & Folder Picker**:
  - Support for per-user local AppData, all-users administrative Program Files, and custom target folders with native directory picker.
- ✅ **Portable Mode Architecture**:
  - Standalone portable mode with `.portable` runtime marker and isolated `./data/` database and cache directory.
- ✅ **PortableApps.com PAF Packaging**:
  - Added PAF packaging configuration and portable archive builds.
- ✅ **Background Service Download Queue Persistence**:
  - SQLite-backed download queue persistence across app restarts in `database.sqlite` (`downloads:jobs`).

### [v0.4.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.4.0) — Dedicated Uninstaller & DB Recovery (2026-09-30)
- ✅ **Dedicated Uninstaller Executable**:
  - Emitted `uninstall.exe` cleanly registered in Windows system uninstallation facilities.
- ✅ **HELIX Origin Attribution**:
  - Updated publisher identity to HELIX Origin across all bundle configurations.
- ✅ **SQLite Mutex Poison Recovery**:
  - Added poison-recovered database locks across all DB commands in `db.rs`.
- ✅ **Download Engine & Favorite Toggle Bug Fixes**:
  - Resolved file-lock collisions on Windows during download rename and fixed favorite button synchronization.

### [v0.3.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.3.0) — Localization Core (M9.1) & Titlebar Search (2026-09-25)
- ✅ **Localization Core Infrastructure (M9.1)**:
  - Created `locale` runes store, `t()` translation helper, system-locale detection command (`get_system_locale`), and offline `npm run i18n:check` validator.
  - Hand-rolled default English pack (`en.json`).
- ✅ **Context-Aware Titlebar Search**:
  - Integrated search query input in titlebar with keyboard shortcut (`Enter`).
- ✅ **Installer Launch Optimization**:
  - Deferred application launch until explicit finish button click.

### [v0.2.1](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.2.1) — Title Bar Simplification & Maintenance Isolation (2026-09-25)
- ✅ **Title Bar Simplification**:
  - Refined title bar styling and controls.
- ✅ **Process Isolation for Maintenance Installer**:
  - Spawned maintenance installer as an isolated process and ensured proper main window destruction.
- ✅ **Console Window Suppression**:
  - Suppressed flashing PowerShell console windows during background actions.

### [v0.2.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.2.0) — Search Filters & Multi-Platform Packaging (2026-09-24)
- ✅ **Comprehensive Search Filter Drawer**:
  - Multi-criteria filtering by text query, language, category, per-type tag inclusions/exclusions, page ranges, and sorting.
- ✅ **Platform-Tagged Installer Download Names**:
  - Standardized release asset naming across Windows, Linux, and macOS.
- ✅ **Open Source Licensing & Citation**:
  - Added BSD 3-Clause `LICENSE.md` and `CITATION.cff`.

### [v0.1.1](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.1.1) — Rebranding & Ecosystem Polish (2026-09-23)
- ✅ **Identifier Rebranding**:
  - Rebranded product identifiers to `nh-desktop` / `nh-reader` (`net.nh-reader.client`).
- ✅ **CI Packaging Matrix**:
  - Configured multi-platform GitHub Actions workflow for Windows, Linux, and macOS.
- ✅ **Agent Ecosystem Standards**:
  - Initialized standing conventions, rule triggers, and verification gates.

### [v0.1.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.1.0) — Foundation (2026-09-22)
- ✅ **Scaffold & Architecture (M1)**:
  - Tauri 2 + SvelteKit static SPA template scaffold with Svelte 5 runes and TypeScript strict.
- ✅ **Rust API Client (`nh_desktop.rs`)**:
  - Throttled `reqwest` client querying nhentai public API v2 endpoints with 26 Tauri commands.
- ✅ **Design System & App Shell**:
  - Plain CSS design tokens (`tokens.css`, `base.css`) with nhentai dark palette (`#141414` / `#1f1f1f` / `#ed2553`).
  - App shell with sidebar navigation, Home, Popular, Favorites, History, Blacklist, and Settings views.
- ✅ **Security Hardening**:
  - Hardened CSP allowlisting `*.nhentai.net` with IPC-only network traffic.
- ✅ **Background Service Worker Queue**:
  - Background worker queue (`service.rs`) and disk image cache (`image_cache.rs`).

### Milestone M9.2: Complete 17 Language Packs Ledger

All 17 community language packs are hand-rolled and shipped with 100% key parity (279/279 keys each, validated via `npm run i18n:check`):

| # | Pack | Code | Status | Verified Keys |
| --- | --- | --- | --- | --- |
| 1 | English (Default) | `en` | ✅ Shipped | 279 / 279 |
| 2 | Japanese | `ja` | ✅ Shipped | 279 / 279 |
| 3 | Simplified Chinese | `zh-CN` | ✅ Shipped | 279 / 279 |
| 4 | Traditional Chinese | `zh-TW` | ✅ Shipped | 279 / 279 |
| 5 | Korean | `ko` | ✅ Shipped | 279 / 279 |
| 6 | Spanish | `es` | ✅ Shipped | 279 / 279 |
| 7 | French | `fr` | ✅ Shipped | 279 / 279 |
| 8 | German | `de` | ✅ Shipped | 279 / 279 |
| 9 | Russian | `ru` | ✅ Shipped | 279 / 279 |
| 10 | Portuguese | `pt` | ✅ Shipped | 279 / 279 |
| 11 | Italian | `it` | ✅ Shipped | 279 / 279 |
| 12 | Thai | `th` | ✅ Shipped | 279 / 279 |
| 13 | Vietnamese | `vi` | ✅ Shipped | 279 / 279 |
| 14 | Indonesian | `id` | ✅ Shipped | 279 / 279 |
| 15 | Polish | `pl` | ✅ Shipped | 279 / 279 |
| 16 | Dutch | `nl` | ✅ Shipped | 279 / 279 |
| 17 | Turkish | `tr` | ✅ Shipped | 279 / 279 |
| 18 | Arabic | `ar` | ✅ Shipped | 279 / 279 |

## ⬜ Backlog / Future Enhancements

- ⬜ **Add the `PAGES_ADMIN_TOKEN` repository secret** (fine-grained token for this repository, Administration: write + Pages: write). One-time step that lets the Pages workflow turn on Pages; GitHub does not allow the workflow token to do it.

All other items from previous milestones and backlogs have been resolved and consolidated into Milestone M12 (Candidate v0.7.0).

## 🔁 Recurring

- ⬜ Run `npm run check` + `cargo check` / `cargo test` before any task is marked done.
- ⬜ Run `npm run check:agents` and `npm run i18n:check` before committing.