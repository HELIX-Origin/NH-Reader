# 📜 NH Reader Changelog

Historical record of every change to the NH Reader client. Newer releases are added at the
top; the current development state lives under `Unreleased`.

## [v0.7.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.7.0)

**Release date:** 2026-10-01

### 🖥️ Custom Title Bar, Per-OS Window Controls & System Tray Restore
* **Custom Integrated Title Bar**: Disabled native OS decorations in `tauri.conf.json` (`"decorations": false`) in favor of an integrated custom title bar across desktop platforms.
* **Per-OS Window Controls (`WindowControls.svelte`)**: Built native-style window controls tailored to the operating system. On macOS, renders unframed traffic lights on the left that reveal inner glyphs on hover. On Windows and Linux, renders compact 24×22px buttons enclosed within a subtle 5px squircle frame (`border: 1px solid var(--border)`, `border-radius: 5px`) with line, square/stacked, and X vector glyphs.
* **Linux Desktop Theme Compatibility**: Highlight and hover states respect custom Linux desktop styling without overriding theme engine color choices.
* **Customizable Window Controls Position**: Added `windowControlsPosition` setting (`Auto`, `Left`, `Right`) under Appearance in Settings, allowing users on Linux and custom window managers to align window controls with their environment conventions.
* **Restored System Tray & Minimize-to-Tray on Close**: Restored `api.prevent_close()` and `window.hide()` in `CloseRequested` event in `src-tauri/src/lib.rs` to allow the window close button to minimize the app into the system tray without terminating background services, while preserving full application quit via the tray menu.
* **Title Bar Drag & Maximize Toggle**: Configured window dragging across empty title bar regions and double-click to toggle maximize/restore with `core:window:allow-is-maximized` permission for reactive icon and tooltip updates.

### 📖 Reader Ergonomics: Preload Buffer, Quality Selector & Direct CBZ Export
* **Configurable Preload Distance**: Added reader preload distance options (`1`, `2`, `3`, `5` pages) dynamically sizing reader slice buffering ahead and behind to provide instant transitions and eliminate page turn delays.
* **Image Quality Selector**: Introduced image quality selection between `Original (High)` (full-resolution streaming from `IMAGE_HOST`) and `Data Saver (Fast)` (compressed previews from `THUMB_HOST` to conserve metered bandwidth and accelerate slow connections).
* **Direct CBZ Export from Reader Toolbar**: Added a dedicated CBZ export button to reader toolbar controls and bound to the `E` keyboard shortcut, triggering background worker queue packaging via `enqueueDownload(id, 'cbz')` with live percentage progress and completion checkmark indicator.
* **Reader Toolbar Quick Controls**: Added quality cycle button to reader controls (with `Q` keyboard shortcut) alongside full controls in Settings.

### 🌐 Complete 17 Language Packs, Arabic RTL Polish & In-Page Live Translation
* **All 17 Language Packs Shipped**: Complete hand-rolled translations for Japanese (`ja`), Simplified Chinese (`zh-CN`), Traditional Chinese (`zh-TW`), Korean (`ko`), Spanish (`es`), French (`fr`), German (`de`), Russian (`ru`), Portuguese (`pt`), Italian (`it`), Thai (`th`), Vietnamese (`vi`), Indonesian (`id`), Polish (`pl`), Dutch (`nl`), Turkish (`tr`), and Arabic (`ar`). All 18 packs achieve 100% key parity (279/279 keys each) validated with `npm run i18n:check`.
* **Arabic RTL Layout Polish (M9.2 RTL Phase)**: Added `isRTL` and `dir` getters to `locale.svelte.ts`, document-level `dir="rtl"` reactivity, Arabic typography font fallbacks (`'Segoe UI Arabic'`, `'Noto Sans Arabic'`, `'Tahoma'`) with ergonomic 1.6 line height, mirrored drawer animations (`nh-drawer-slide-rtl`), mirrored toggle switch knobs, and RTL search alignments.
* **Per-Locale Date and Number Formatting**: Upgraded `src/lib/format.ts` (`formatCount`, `formatDate`, `relativeDate`, `formatBytes`) to use browser standard `Intl.NumberFormat`, `Intl.DateTimeFormat`, and `Intl.RelativeTimeFormat`, dynamically linked to `locale.value`.
* **Documentation Migration to `docs/` with Live Translation Dropdown**: Moved documentation from GitHub Wiki into the repository `docs/` folder (`docs/README.md` as entrypoint). Added interactive in-page Google Translate dropdown widget (`docs/translate.js`) at the top-right of all markdown files with all 18 supported languages, and replaced external sidebar/footer with in-page breadcrumb navigation and index footers.

### 📦 Multi-Platform Portability & CI Packaging with Android Split APKs
* **Standalone Multi-Platform Portable Packages**: Implemented standalone portable packages (`NHReaderPortable_Windows_x64.zip`, `nh-reader_portable_linux_x86_64.tar.gz`, `NHReaderPortable_macOS.zip`) sharing root `.portable` marker and isolated `./data/` folder, with ancestor traversal in `src-tauri/src/lib.rs`.
* **Universal Portable Launcher Scripts**: Added standalone launcher scripts `scripts/launch-linux.sh`, `scripts/launch-macos.command`, and `scripts/launch-windows.bat`.
* **Decoupled Downstream Release Publishing**: Decoupled asset publishing from build runners into a dedicated downstream `publish-release` job, eliminating race conditions on release creation and ensuring that failed builds never produce partial releases.
* **Dedicated Android Split APKs**: Added dedicated `package-android` job in CI building separate APK files for each supported Android architecture (`aarch64` / arm64-v8a, `armv7` / armeabi-v7a, `x86_64`) via `--apk --split-per-abi`, excluding universal APKs to minimize file size.
* **True Dry Run Mode & Test Pre-Release**: Added true dry-run mode via `workflow_dispatch` input (`dry_run: true`) to validate and verify all packages without publishing to GitHub releases, alongside optional draft pre-release creation (`create_test_release: true`) for testing asset uploads safely.
* **Per-Platform Tauri Configs & Node.js 26 Upgrade**: Added `tauri.<platform>.conf.json` platform configurations and upgraded CI packaging workflow to Node.js 26.
* **NSIS Theme & Contrast Alignment**: Configured coordinated text and background colors in `src-tauri/windows/hooks.nsh` to eliminate black-on-dark unreadable text and preserve dark DWM title bars.
* **Official App Icon Installer Bitmaps**: Generated crisp 150×57 `header.bmp` and 164×314 `sidebar.bmp` assets directly from `icon.png` via `scripts/generate-installer-bitmaps.ps1`.
* **GitHub Discussions Release Announcements**: Seeded release announcements for all historical versions (`v0.1.0` – `v0.6.0`) under `.github/discussions/announcements/` and created standardized announcement template (`.agents/templates/release-announcement.md`).


## [v0.6.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.6.0)

**Release date:** 2026-10-01

### 📦 Rebuilt Native Installer Engine & Custom NSIS Template
* **Tauri Native Packaging with NSIS template**: Rebuilt the installer to use Tauri 2's native packaging toolchain (`tauri build`) augmented with a custom NSIS hook template (`src-tauri/windows/hooks.nsh`), providing a custom NSIS installer setup.
* **Dual installation scopes**: Added support for both per-user (local AppData without elevation) and per-machine (administrative Program Files) installation targets, custom directory selection, and Start Menu/Desktop shortcuts.
* **Standard Windows Uninstaller**: Automatically registers uninstaller in Windows "Installed apps" / "Add or remove programs", ensuring a clean uninstall that removes binaries and shortcuts while offering to preserve local user data.
* **Enterprise WiX MSI & Portable Mode**: Built WiX `.msi` installers and clean standalone portable `.zip` archives with isolated `./data` runtime directories, fully retiring legacy custom webview installer routes (`src/routes/installer/`) and manual installer builder scripts.
* **Free Code Signing Pipeline**: Added PowerShell code signing script (`scripts/sign.ps1`) and npm command (`npm run sign:windows`) utilizing local self-signed code-signing certificates.

### 💖 Library Downloaded Favorites Isolation (Track 9)
* **Scoped Library Favorites tab**: Configured the Library's "Favorites" tab (`FavoritesView.svelte` with `downloadedOnly={true}`) to strictly display downloaded favorites (`isDownloaded(id)`), isolating it from the primary standalone `/favorites` tab which continues to show all favorites.
* **Dedicated counter and empty state**: Wired a dedicated downloaded favorites counter to the Library tab badge and added distinct empty state messaging (`No downloaded favorites`) explaining that favorited galleries appear here once downloaded.

### 🪟 Clean Window Exit & Refined Rounded Square Radiuses (Track 8)
* **Orderly window close & exit lifecycle**: Removed `api.prevent_close()` on the native system titlebar close ("X") button in `lib.rs` and replaced premature Win32 `window.destroy()` calls with clean `app.exit(0)`, preventing background zombie processes, avoiding forced SIGINT (`0xc000013a`) terminations, and eliminating WebView2 `Chrome_WidgetWin_0` class unregister Error 1411.
* **Refined small rounded square corner radiuses**: Softened the overly sharp 4px radius limit to modern rounded square corners (`8px` - `10px` squircle styling) across the floating bottom bar (`10px`), bottom navigation item pills and active icon wrappers (`8px`), downloaded doujin cards (`8px`), badges and action buttons (`6px`), and category tabs (`8px`).

### 📚 Dedicated Library Tab & Offline Archive Reading (Track 7)
* **Primary Library navigation tab**: Added `/library` as a core bottom navigation tab with an open book icon (`book`), providing direct access to local doujins, downloads, favorites, and history.
* **Downloaded doujins shelf (`DownloadedView.svelte`)**: Interactive shelf scanning `.zip` and `.cbz` archives in the downloads folder, displaying cover thumbnails, titles, page counts, file sizes, format badges, and direct "Read" and "Delete" actions.
* **Direct reading from downloaded archives**: Implemented backend Tauri commands (`get_downloaded_galleries`, `get_downloaded_gallery_page`, `get_downloaded_gallery_info`, `has_downloaded_gallery`, `delete_downloaded_gallery`) to parse, sort, and stream page bytes directly from local archives.
* **100% offline reader support**: Enhanced `ReaderImage.svelte` and `gallery/[id]/reader` to stream and decode pages directly from downloaded `.zip`/`.cbz` archives without requiring network access.
* **Unified library categories**: Multi-tab switcher in `/library` allowing quick navigation between Downloaded doujins, Favorites, and Reading History.

### ⚡ Upstream API Alignment, Authentication & UI Refinement (Track 6)
* **Official archive downloads via API**: Replaced page-by-page CDN walking and archive reconstruction with direct calls to `POST /api/v2/galleries/{id}/download?format={format}`, complying with official API docs. Includes streaming download and byte progress.
* **Dedicated Account Login Modal (`LoginModal.svelte`)**: Added a modal dialog with dual tabs: official API Key sign-in (recommended, bypasses Cloudflare CAPTCHAs) and direct credentials authentication (`POST /api/v2/auth/login`).
* **Reactive account state & live username display**: Converted `getAccountState()` properties in `account.svelte.ts` to Svelte 5 reactive getters, fixing real-time username and avatar rendering upon connection.
* **Account profile and blacklist isolation**: Ensured numeric tag IDs are resolved for `POST /api/v2/blacklist` and strictly isolated from user account settings and `favorite_tags`.
* **Native window titlebar & in-app top bar**: Restored native system window decorations (`decorations: true` in `tauri.conf.json`) and converted custom window chrome into a clean in-app top bar with brand, quick search, and account controls.
* **Floating Mihon-style bottom navigation**: Elevated bottom navigation into a floating pill with a 4px corner radius, backdrop blur (`rgba(31,31,31,0.92)`), elevation shadow, and safe bottom content padding.
* **Full-width settings layout**: Expanded settings view panels to span 100% of container width, eliminating left-aligned layout constriction.
* **Login modal visual polish & opaque styling**: Fixed avatar URL parsing for protocol-relative (`//static.nhentai.net/...`) paths, added `onerror` fallback to user initial placeholder, eliminated transparent layout sections by establishing solid dark-surface backgrounds (`#1f1f1f` / `#252525`), and resolved all clipping and mangling in the account dialog.
* **Complete wiki and documentation synchronization**: Rewrote and aligned all 19 wiki pages, `README.md`, `ROADMAP.md`, `TODO.md`, and `.agents/` guidelines to match the current NH Reader architecture, native packaging, and upstream API v2 integration.

### 🏷️ Product Rebrand & Decoupling
* **Rebranded to NH Reader**: Product renamed to **NH Reader** across desktop and mobile platforms, updating Tauri configs, window titles, and package definitions.
* **Storage decoupling with `database.sqlite`**: SQLite storage migrated from hardcoded brand names to ambiguous `database.sqlite` with automated migration from legacy `nh-desktop.db` and key prefix rewrites (`nh-reader:`).

### 📱 UI Overhaul: Mihon-Style Bottom Navigation
* **Mobile-friendly navigation**: Replaced the desktop fixed sidebar with a sleek, responsive Mihon-inspired bottom navigation bar (`<nav class="bottom-nav">`) utilizing nhentai's dark palette (`#1f1f1f` / `#ed2553` accent).
* **Increased horizontal canvas**: Reclaimed 220px of desktop sidebar width for gallery cards and reader displays.

### 🌐 Localization (Track 1 Complete)
* **Comprehensive UI string coverage**: Wrapped remaining hardcoded UI strings across all views into single-quoted `locale.t()` calls (`SettingsView`, `DownloadsView`, `BlacklistView`, `GalleryDetailView`, `ReaderView`, `FilterPanel`, `SearchView`, `FavoritesView`, `HistoryView`, `GalleryCard`).
* **English dictionary expansion**: Expanded `en.json` to 217 keys covering 206 references with 0 missing or untranslated keys.

### 📥 Downloads & Library Polish (Track 2 Complete)
* **Download queue persistence**: Active, completed, and failed download jobs are stored persistently in `database.sqlite` via `downloads:jobs`. Unfinished or interrupted downloads upon app exit cleanly resume as failed with a 1-click retry option.
* **Auto-refresh cache consumers**: Fixed legacy `nh-desktop:` cache keys in `service.rs`. Configured `service://refresh` to invalidate in-memory caches and dispatch real-time events (`nh-reader:refresh:popular`, `nh-reader:refresh:account`), enabling the Popular view and Account data to seamlessly re-render.
* **JSON export and import**: Added zero-dependency universal export and import utilities for Favorites and Blacklist (`downloadJson` and `pickAndReadJson`), accessible directly from `FavoritesView`, `BlacklistView`, and the Settings Data management panel.
* **Portability validation & cache maintenance**: Verified `.portable` and `./data` execution isolation and updated the cache pruner in `db.rs` to clean both `nh-reader:cache:%` and legacy cache rows.

### 🗄️ Cache Management & Storage Optimization (Track 3 Complete)
* **Configurable cache storage budgets**: Users can select maximum disk storage caps (500 MB, 1 GB, 2 GB, 5 GB, or Unlimited) from Settings to constrain disk footprint.
* **LRU image cache eviction**: Background service checks image cache usage and evicts oldest accessed files down to 85% of budget when the limit is exceeded or during maintenance.
* **Database compaction & isolated cache clearing**: Fixed cache flushing to selectively purge API response rows without touching user favorites, blacklist, history, or settings. Added SQLite `VACUUM` support to physically reclaim disk space.
* **Real-time storage telemetry**: Settings UI displays live disk consumption for image cache (bytes + file count), response cache entries, and total SQLite database footprint.

### 📱 Mobile Support — Android (Track 5 Complete)
* **Android mobile toolchain**: Configured Tauri 2 Android project capabilities (`minSdkVersion: 24`, APK packaging) via `npm run mobile:android:init` / `npm run mobile:android:build`. iOS is not supported.
* **Platform boundary isolation**: Guarded desktop-specific single-instance plugins, system tray menus, and window close-to-tray listeners behind `#[cfg(desktop)]` in `src-tauri/src/lib.rs` for pristine compilation on mobile targets.
* **Untested mobile hardware status**: Documented that because the maintainer lacks a physical Android device, Android builds are currently community-supported and untested.

### 🎨 UI Consistency & Polish Audit (Track 4 Complete)
* **Design system token normalization**: Fixed missing CSS variable declarations in `tokens.css` (`--text-soft`, `--text-sm`, `--text-xs`, `--radius-md`) and harmonized color definitions with nhentai.net's dark palette (`#141414` / `#1f1f1f` / `#ed2553`).
* **High-contrast text tokens**: Elevated `--text-faint` to `#858585` and `--text-secondary` to `#a8a8a8`, satisfying WCAG AA contrast against `#1f1f1f` surfaces.
* **Mihon bottom navigation polish**: Fine-tuned active pill indicator geometry (52×28px with 14px radius) and safe-area inset ergonomics (`max(4px, env(safe-area-inset-bottom))`).
* **Mobile & touch ergonomics**: Implemented 2-column mobile gallery grid scaling on viewports under 600px and enabled always-accessible favorite hearts on touch pointers (`@media (pointer: coarse)`).

### 📐 Dynamic UI Scaling & Zero-Empty-Card Layout
* **Automatic window column fitting**: Added dynamic container measuring in `GalleryGrid.svelte` that continuously calculates the optimal column count (`cols`) based on window width.
* **Zero empty card slots**: Fitted the visible cards per page to complete rows (`Math.floor(visible.length / cols) * cols`), eliminating trailing gaps or orphaned cards at the bottom of the grid.
* **Proportional card expansion**: Added `.grid.dynamic` in `app.css` using `repeat(var(--grid-cols, 5), minmax(0, 1fr))`, ensuring cards fluidly scale to fill 100% of the window width without distortion.
* **User toggle**: Added a master "Dynamic UI scaling" switch in Settings with localized labels and descriptions.

## [v0.5.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.5.0)

**Release date:** 2026-09-30

### 📦 Installer & Deployment Enhancements
* **Installation scope selector**:
    * **Three installation targets**: Users can choose between "Install for current user" (default per-user directory), "Install for all users" (system-wide Program Files), and "Custom install directory".
    * **Native folder picker**: A native OS folder dialog (`installer_pick_directory`) allows selecting any custom installation folder across Windows, Linux, and macOS.
* **Portable mode**:
    * **Self-contained runtime**: Optional toggle in installer to run completely self-contained. All data (`nh-desktop.db`, `cache/images`, settings, and downloads) is stored in `<install_dir>/data`.
    * **Zero footprint**: Skips deploying `uninstall.exe`, creating desktop/Start Menu shortcuts, and writing Windows Add/Remove Programs registry keys.
* **PortableApps.com Format (PAF) packaging**:
    * **Official layout & PAF installer**: Generates standard PortableApps directory structure (`App/`, `Data/`, `Other/`) and compiles `NHDesktopPortable_<version>.paf.exe` via `scripts/build-installer.mjs` and GitHub Actions.

## [v0.4.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.4.0)

**Release date:** 2026-09-30

### 📦 Installer & Uninstaller

* **Dedicated uninstaller executable**:
    * **Independent uninstaller binary**: On Windows, the installer deploys `uninstall.exe` alongside `NH Desktop.exe` in the application directory. Linux deploys `uninstall`.
    * **No executable locking**: When `uninstall.exe` is invoked, it relocates to a temporary directory before execution so neither `NH Desktop.exe` nor `uninstall.exe` in the program files folder is locked, allowing `std::fs::remove_dir_all` to cleanly remove the entire installation directory.
    * **Windows Add/Remove Programs**: The Windows registry `UninstallString` now targets `"<install_dir>\uninstall.exe"`, and the `Publisher` attribute is correctly configured as `HELIX Origin`.
    * **Direct uninstall flow**: Launching `uninstall.exe` immediately navigates to the uninstall options view.

### 🌐 Localization

* **100% drop-in hand-rolled architecture**:
    * **Zero-dependency localization**: Dropped fluent and `unic-langid` dependencies in favor of a fast, self-contained `LocaleCatalog` class using Vite dynamic glob imports.
    * **English-only default with OS fallback**: Ships hand-rolled English (`en.json`) by default, with automatic fallback to the operating system locale and then to English.
    * **True drop-in translation packs**: Community contributors can add new languages simply by dropping a `<locale>.json` file into `src/lib/i18n/` without modifying code or config registries.
    * **Translation contribution guide**: Added complete instructions and JSON structural schema reference (all 78 keys + `_meta`) to `CONTRIBUTING.md`.

### 📥 Downloads & Background Service

* **Direct page download pipeline**:
    * **No API key required for downloads**: Replaced external API-key download dependency with in-app page fetching that downloads images directly from allowlisted hosts and bundles them into cleanly formatted `.zip` or `.cbz` archives locally.
    * **Real-time per-page progress**: Background download jobs report incremental page-by-page progress to the Downloads view and system notifications.

### 💖 Favorites & Library

* **Favorites button synchronization**:
    * **Instant reactive updates**: Fixed the favorite toggle button on gallery detail pages so clicking immediately flips between "Favorite" and "Saved" with matching visual states, maintaining exact consistency with local SQLite storage.

### 🛡️ Hardening & Reliability

* **Poison-recovered SQLite mutex locks**: Added `lock_conn()` poison recovery in `db.rs` to prevent database access panics if a mutex poison occurs.
* **Author & Metadata Alignment**: Configured author/publisher to `HELIX Origin` across `package.json`, `Cargo.toml`, and platform metadata.

### 📝 Docs

* **Agent ecosystem rebuilt from scratch**: The previous `.agents/` tree was removed and replaced with a smaller, mechanically enforced design.
    * **`AGENTS.md` is the authority**: every hard rule now lives in the always-loaded root file. `.agents/rules/**` holds on-demand depth with declared triggers and enforcement.
    * **Roles restructured**: four primaries — `engineer`, `reviewer`, `planner`, `steward` — each declaring Owns/Reads/Does/Never/Hands-off-to.
    * **Mechanical gate**: `npm run check:agents` validates ecosystem structure, rule and role contracts, broken links, branding, and no-comments / no-`any` / no-`unwrap` policies.
    * **Documentation synchronization**: Synchronized all wiki articles and repository root guides with current architecture.

## [v0.3.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.3.0)

**Release date:** 2026-09-25

### ✨ Added

* **Localization & language packs (M9)**: The app interface can now be displayed in a language of
  your choice, defaulting to the operating system locale.
    * **Language packs**: Complete packs for **English** (source), **Japanese (`ja`)**, **Chinese
      Simplified (`zh-Hans`)**, and **Chinese Traditional (`zh-Hant`)** — 78 keys each. The other
      nhentai content languages are registered and selectable, falling back to English per-key;
      their packs are deferred to future work and community contributions.
    * **Installer language picker**: The setup wizard's *Options* step now includes a **Language**
      dropdown; the installer itself renders in the system language so the options are readable
      before you choose.
    * **Settings language picker**: `Settings → Appearance → Language` changes the interface
      immediately, with no restart.
    * **System locale detection**: New `get_system_locale` Tauri command (`sys-locale`) resolves
      the OS locale; regional variants map sensibly (`zh-*` → Simplified by default) and unknown
      locales fall back to English.
    * **Graceful fallback**: `t('key')` resolves against the active dictionary and falls back to
      English for any missing key, so a partial pack degrades gracefully instead of rendering raw
      keys.
    * **Validator**: `npm run i18n:check` reports missing keys, untranslated leftovers, and
      unknown keys for every pack. Fully offline and free.
    * **Contributor documentation**: New [Localization](docs/Localization.md) covering both improving existing
      packs and adding new languages, including free cross-reference resources for verifying
      terminology. Linked from `Home`, `Settings & API Key`, `Installation & Maintenance`, the
      sidebar, and the wiki index.
* **Context-aware titlebar search**: The titlebar quick-search now acts on the page you are
  actually on instead of always jumping to a global search.
    * **Search page**: submitting updates the existing search query in place.
    * **Favorites / History**: submitting filters the local list by title; clearing the box
      restores it.
    * **Every other page**: falls back to a global search.
* **Titlebar layout**: The quick-search box is now centred, and the account chip sits adjacent to
  the window controls (left of them on Windows/Linux, right of them on macOS) instead of at the
  far edge.

### 🔧 Changed

* **Milestone tracking**: Added **M9 — Localization & language packs** to `ROADMAP.md` (with a
  three-phase plan) and split `TODO.md` into **M9.1** (shipped core) and **M9.2** (the 14
  remaining language packs, itemised but deliberately not started).
* **Version sync**: `package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, and
  `src-tauri/Cargo.lock` bumped to `0.3.0`; the sidebar version readout was corrected from the
  stale `v0.2.0` to `v0.3.0`.

### 🐛 Fixed

* **Installer launched the app before you finished**: The setup wizard used to start NH Desktop
  while `perform_install` was still running, so the app appeared to jump the queue on top of the
  installer.
    * **Deferred launch**: Removed `launch_after` from `InstallOptions` and the launch side effect
      from `perform_install`.
    * **Explicit launch step**: New `installer_launch_app` command, invoked only when the user
      clicks **Finish** with "Launch after finish" checked. A launch failure is non-fatal — the
      wizard still closes cleanly.

## [v0.2.1](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.2.1)

### ✨ Added

* **(none)**: No new user-facing features in this patch release.

### ✅ Changed

* **Agent ecosystem & project docs audit**: Performed a full correctness pass over `.agents/`, root docs, and the wiki so AI agents have a single, non-contradictory source of truth.
    * **Persistence model**: Corrected all references from browser `localStorage` to the SQLite-backed KV cache (`src/lib/cache.ts` → Tauri `db_*` commands → `nh-desktop.db`).
    * **Frontend structure**: Documented the flat `src/lib/` module layout (`api.ts`, `client.ts`, `types.ts`, `query.ts`, `image.ts`, `format.ts`, `cache.ts`) and `src/lib/design/` tokens/base styles.
    * **Component naming**: Codified PascalCase Svelte component files (`GalleryCard.svelte`) and component names.
    * **Backend module layout**: Added `db.rs`, `image_cache.rs`, `service.rs`, `installer.rs`, and `platform/` to the documented backend structure.
    * **CSP & image hosts**: Aligned the security rule with `tauri.conf.json` and the `AGENTS.md` decision log: `img-src 'self' data: blob: https://nhentai.net https://*.nhentai.net`.
    * **Command count**: Updated all command-count references to 43 Tauri commands.
    * **Installer artifacts**: Corrected Windows platform tag from `windows-x64` to `win-x64` and binary name from `nhentai` to `nh-desktop`.
    * **App data paths**: Updated privacy/troubleshooting paths to the Tauri bundle identifier `net.nh-desktop.client` (`%APPDATA%\net.nh-desktop.client`, `~/Library/Application Support/net.nh-desktop.client`, `~/.local/share/net.nh-desktop.client`).
    * **Requirements tracking**: Created `.agents/tracking/requirements/.gitkeep` so the requirements sub-agent's documented path resolves.
* **Milestone status sync**: Updated `TODO.md`, `ROADMAP.md`, and [Roadmap](../../wiki/Roadmap) to mark shipped M7/M8 work (downloads UI, light theme, configurable downloads folder) and set current focus to M1 Foundation closeout plus remaining M8 polish.
* **Version bump**: Synchronized `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json` to `0.2.1`.

### 🐛 Fixed

* **Installer titlebar & window controls**: Simplified the installer window chrome so controls respond reliably and the bar remains draggable.
    * **Direct window APIs**: Finish/Close/Min/Max now call `getCurrentWindow().close()`, `.minimize()`, and `.toggleMaximize()` directly instead of nested try/catch fallback chains.
    * **Draggable header**: Kept drag-to-move via `startDragging()` on the custom header; removed stale `data-tauri-drag-region` and the installer-specific `app_quit` fallback.
    * **No duplicated chrome**: Confirmed the installer window uses `.decorations(false)` so only the custom HTML titlebar renders.

## [v0.2.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.2.0)

### ✨ Added

* **Custom UI shell**: Built a native-feeling desktop shell inside the Tauri WebView.
    * **Sidebar navigation**: Quick access to New, Popular, Favorites, History, Blacklist, and Settings.
    * **Frameless titlebar**: macOS-style traffic lights with per-OS ordering, drag-to-move, and double-click maximize.
    * **System tray**: Show/minimize/quit menu, tray icon, and hide-to-tray on main-window close.
    * **Single-instance support**: `tauri-plugin-single-instance` focuses the running window instead of spawning duplicates.
* **Search & filters**: A filter drawer covering text query, language, category, per-type tag include/exclude (artist, character, parody, group, language, tag), page-count ranges, and six sort modes, all compiled into native nhentai query syntax.
* **Global blacklist**: Two-layer blacklist that never silently breaks the grid.
    * **Server-side excludes**: Blacklisted tags are appended as `-tag:` / `-type:` tokens to every search query.
    * **Client-side hide/blur**: Grid cards matching blacklist entries are hidden or blurred according to user preference.
    * **Master toggle**: Instantly enable or disable the entire blacklist.
* **Library views**: Favorites and History pages with runes-backed state and SQLite persistence through `src/lib/cache.ts`.
* **Reader**: Full gallery consumption experience.
    * **Detail page**: Cover, title, artists, parody, language, category, page count, score, related galleries, and quick-add to blacklist.
    * **Paged & strip modes**: Thumbnail strip, arrow-key navigation, click zones, fit modes (width/height/contain), preload, and fullscreen.
    * **Progress tracking**: Reading position is recorded in history.
* **Background service**: `src-tauri/src/service.rs` runs a throttled one-at-a-time worker queue surfaced through `service_*` commands and `service://job` / `service://refresh` events.
    * **Gallery downloads**: ZIP/CBZ/torrent downloads to disk with live progress in Settings.
    * **Image prefetch**: Preload image URLs into the disk cache.
    * **Cache maintenance**: Prune stale image cache entries and cached lists.
    * **Account sync**: Pull account favorites and blacklist from nhentai.net when an API key is configured.
    * **Popular auto-refresh**: Optional periodic refresh of the Popular list.
* **Unified installer/uninstaller**: Tauri-native setup wizard built into the same binary as the app.
    * **Install flow**: Welcome → Location → Options → Install → Finish with Desktop/Start Menu shortcuts and PATH registration.
    * **Maintenance mode**: Reinstall, repair shortcuts, and uninstall with optional user-data removal.
    * **Per-OS implementations**: `src-tauri/src/platform/{windows,macos,linux}.rs`.
* **Disk image cache**: `src-tauri/src/image_cache.rs` stores fetched images under `cache/images` with atomic tmp+rename writes; backs `proxy_image` cache-first and is pruned by maintenance.
* **Agent ecosystem**: Introduced `.agents/` with rules, primary/sub agent roles, skills, templates, and tracking directories to guide AI-assisted development.

### ✅ Changed

* **Rebrand to NH Desktop**: Product identity, executable name (`NH Desktop.exe`), bundle identifier (`net.nh-desktop.client`), crate/package names (`nh-desktop` / `nh_desktop_lib`), and cache prefix (`nh-desktop:`) unified.
* **CI packaging**: Added GitHub Actions workflow and `scripts/build-installer.mjs` to build and publish the unified installer binary.
* **Fixed dev port**: Vite dev server locked to `14440` (HMR `14441`); removed auto-incrementing `scripts/dev.mjs`.
* **CSP hardening**: `img-src` allow-listed for nhentai hosts plus `data:`/`blob:`, IPC-only `connect-src`, and a separate `devCsp` for Vite HMR.
* **App icon wired**: Favicon, sidebar brand, installer brand marks, tray icon, and installer/maintenance window icons.
* **Version metadata**: Synchronized `package.json`, `Cargo.toml`, and `tauri.conf.json` to `0.2.0`.

### 🐛 Fixed

* **(none)**: No explicit fixes in this milestone release.

## [v0.1.1](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.1.1)

### ✨ Added

* **(none)**: No new features in this patch release.

### ✅ Changed

* **(none)**: No changes in this patch release.

### 🐛 Fixed

* **Installer download names**: Added platform and architecture tags to installer filenames (e.g. `NH Desktop-Setup-v0.1.1-win-x64.exe`, `-macos-arm64`, `-linux-x64`) so users can identify the correct download and CI assets do not collide across platforms.

## [v0.1.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.1.0)

### ✨ Added

* **Initial project scaffold**: NH Desktop client foundation for nhentai.net.
    * **Tech stack**: Tauri 2 Rust backend + SvelteKit static SPA.
    * **API client**: Throttled reqwest client with typed serde models for nhentai.net API v2.

### ✅ Changed

* **(none)**: No changes in initial release.

### 🐛 Fixed

* **(none)**: No fixes in initial release.

---

| Version | Title | Description |
| :---: | :---: | :---: |
| 0.2.1 | v0.2.1 — installer titlebar polish + agent/docs audit | Patch release fixing installer titlebar/window controls and auditing agent ecosystem + project docs |
| 0.2.0 | v0.2.0 — custom UI shell + background service | Milestone release with full SPA shell, search/filter, blacklist, reader, background service, unified installer, and agent ecosystem |
| 0.1.1 | v0.1.1 — platform-tag installer names | Patch release adding platform/arch tags to installer download filenames |
| 0.1.0 | v0.1.0 — initial release | Initial NH Desktop client scaffold for nhentai.net |

---

**Last updated:** 2026-09-25
