# TODO.md

> Actionable task ledger. Statuses: ⬜ backlog · 🚧 in progress · ✅ done.
> High-level direction lives in `ROADMAP.md`; role and workflow definitions live in
> `.agents/` (see `.agents/ROLES.md`).
>
> When a task changes behavior or scope, update this file **in the same change**.
> When a task is done, move it to the bottom under **Done** and link the PR/commit if any.

## 🎯 Planned: Restore Full Mobile Support (Android & iOS — Excluded from CI Workflow)

- ⬜ **Restore Full Mobile Toolchain (Android & iOS)**:
  - Restore iOS scripts (`mobile:ios:init`, `mobile:ios:build`) in `package.json` alongside Android tooling (`mobile:android:*`) to support building mobile packages locally via Tauri CLI.
  - Restore mobile settings section, documentation, and community sideloading instructions (APK for Android, sideloading/AltStore for iOS).
  - Exclude mobile targets from the automated GitHub Actions release workflow (`package.yml`), keeping CI strictly dedicated to desktop targets (Windows, Linux, macOS) while mobile builds remain locally operated.
  - **Note on CI Exclusion**: The sole reason automated mobile builds are not included in the CI workflow is because the AI is a piece of shit and can't figure out how to handle workflow files properly.

## 🎯 Current Milestone Progress: v0.6.1 (Multi-Platform Portable, NSIS Dark Theme & Asset Branding)

### 📌 Completed Tasks (v0.6.1):
- ✅ **Multi-Platform Portable Packages (Windows, macOS, Linux)**:
  - Added portable archive packaging for all desktop targets in the release pipeline (`.github/workflows/package.yml`):
    - **Windows**: `NHReaderPortable_Windows_x64.zip` (standalone `NH Reader.exe` with `.portable` runtime marker and data directory support).
    - **Linux**: `nh-reader_portable_linux_x86_64.tar.gz` (standalone compiled binary with `.portable` runtime marker, running without system package installation).
    - **macOS**: `NHReaderPortable_macOS.zip` (portable `.app` bundle with `.portable` runtime marker inside the app root for isolated execution).
- ✅ **Installer Bitmaps Generation from Official App Icon**:
  - Replaced crude placeholder glowing circles with crisp, high-resolution assets generated directly from `src-tauri/icons/icon.png` with exact sampled `#0d0d0d` background (`header.bmp` [150×57] and `sidebar.bmp` [164×314]). Created repeatable generation script `scripts/generate-installer-bitmaps.ps1`.
- ✅ **NSIS Control & Text Legibility Fix**:
  - In `src-tauri/windows/hooks.nsh`, removed conflicting `MUI_BGCOLOR`, `MUI_TEXTCOLOR`, and `MUI_INSTFILESPAGE_COLORS` defines that caused white-on-white and white-on-gray unreadable text in NSIS dialogs, while preserving DWM dark window title bar attributes.
- ✅ **CI & Packaging Workflow Stabilization**:
  - Rebuilt `.github/workflows/package.yml` matrix so each runner strictly builds and searches for its own platform artifacts, preventing false-positive uploads and runner crosstalk.
  - Configured `if-no-files-found: error` in `upload-artifact` and `fail_on_unmatched_files: true` in `action-gh-release` to prevent silent packaging failures.
  - Added an explicit pinned Android NDK (`27.2.12479018`) install step via `sdkmanager` exporting `NDK_HOME` into `$GITHUB_ENV`.
  - Dropped iOS packaging runner from CI matrix until manual Apple Developer team signing is configured.
- ✅ **Clean up tauri.conf.json**:
  - Removed leftover `"iOS"` block from `src-tauri/tauri.conf.json`.

## 🎯 Previous Status: Complete (Track 9: Library Downloaded Favorites Isolation)

### 📌 Completed Tasks (Track 9):
- ✅ **Downloaded Favorites Filter**: Scoped the Library's "Favorites" tab (`FavoritesView.svelte` with `downloadedOnly={true}`) to exclusively display downloaded favorites (`isDownloaded(id)`), decoupling it from the standalone `/favorites` tab which continues to display all favorites.
- ✅ **Library Tab Badges & Empty State**: Updated the Library tab favorites counter to strictly reflect downloaded favorites, with dedicated title and empty state messaging when no favorites have been downloaded.

### 📌 Completed Tasks (Track 8):
- ✅ **Clean Window Close & Process Shutdown**:
  - Removed `api.prevent_close()` on native title bar close ("X") in `lib.rs`, triggering `app.exit(0)` directly.
  - Eliminated premature Win32 `window.destroy()` calls in `app_quit` and tray quit handler, allowing WebView2 to gracefully unregister `Chrome_WidgetWin_0` without Error 1411 and terminating the process cleanly without requiring SIGINT (`0xc000013a`).
- ✅ **Refined Rounded Square Radiuses**:
  - Replaced strict 4px limits with small rounded square corners (`8px` - `10px` squircle styling) across the floating bottom bar (`10px`), bottom nav items and icon wrappers (`8px`), downloaded doujin cards (`8px`), badges and buttons (`6px`), and library tabs (`8px`/`6px`).

### 📌 Completed Tasks (Track 7):
- ✅ **Primary Library Navigation**: Added `/library` bottom navigation item with `book` icon in `+layout.svelte` placed prominently alongside Popular.
- ✅ **Downloaded Doujins Backend**: Implemented `get_downloaded_galleries`, `get_downloaded_gallery_page`, `get_downloaded_gallery_info`, `has_downloaded_gallery`, and `delete_downloaded_gallery` in `commands.rs` scanning and extracting `.zip`/`.cbz` archives in `downloads_dir`.
- ✅ **Offline Archive Reader**: Enabled `ReaderImage.svelte` and `gallery/[id]/reader` to stream and decode pages directly from downloaded archives without network requests, supporting full offline reading.
- ✅ **Library View & Shelves**: Created `src/routes/library/+page.svelte` and `DownloadedView.svelte` featuring a downloaded doujins shelf with cover previews, titles, format badges (`ZIP`/`CBZ`), page count, file size, direct "Read" buttons, and category tabs (Downloaded, Favorites, History).
- ✅ **Localization & Integration**: Added all library and offline reading strings to `en.json` (100% key coverage).

### 📌 Completed Tasks (Track 6):
- ✅ **Download Pipeline & UI Performance**:
  - Throttled download byte progress event emissions in `service.rs` (every >= 200ms) to eliminate event-loop flooding and UI freezing.
  - Flushed and dropped open file write handles before `std::fs::rename` in `service.rs` to prevent Windows OS error 32 file-lock collisions.
  - Decoupled progress event handling in `service.svelte.ts` from disk I/O, writing to SQLite only on terminal state transitions (`finished`, `failed`, `queued`).
  - Polished finished download actions in `downloads/+page.svelte` with dedicated "Open folder" and gallery navigation links.
- ✅ **Top-Bar Window Dragging**:
  - Added `data-tauri-drag-region`, `-webkit-app-region: drag` on the in-app `.top-bar`, and programmatic `startDragging()` via Tauri window API for non-interactive drag zones.
- ✅ **Login Modal & Connected Profile UI Polish**:
  - Fixed broken avatar image URL generation in `image.ts` to properly handle protocol-relative (`//static.nhentai.net/...`) and absolute paths without double-domain corruptions, and added `onerror` fallback to initial placeholder badge.
  - Eliminated transparency issues by providing solid opaque dark-surface backgrounds (`#1f1f1f` / `#252525` / `#262626`) and defining `--surface-panel` and `--border-subtle` tokens.
  - Resolved clipping and mangled layout with concrete spacing, flex wrapping, ellipsis handling, and active account status badges.
- ✅ **Official Archive Downloads via API (`POST /api/v2/galleries/{id}/download`)**:
  - Adopted official dedicated archive endpoint to download pre-built zip/cbz archives rather than reconstructing them by walking CDN page URLs.
  - Fallback gracefully when unauthenticated or if upstream server feature is disabled.
- ✅ **Dedicated Account Login & Authentication Modal**:
  - Implemented `LoginModal.svelte` with dual tabs: API Key (recommended, bypasses CAPTCHA) and Credentials (`POST /api/v2/auth/login`).
  - Wired modal toggle to header account chip and settings view.
- ✅ **Reactive Account State & Real-Time Username Display**:
  - Fixed `getAccountState()` in `account.svelte.ts` with reactive getters so username and avatar immediately display upon authentication.
  - Hardened serde deserialization in Rust `UserMeResponse` with `#[serde(default)]`.
- ✅ **User Profile & Blacklist Tag Isolation**:
  - Ensured `update_account_blacklist` strictly resolves numeric tag IDs for `POST /api/v2/blacklist` and never overwrites user profile or `favorite_tags`.
- ✅ **Native Window Titlebar & In-App Top Bar**:
  - Enabled `"decorations": true` in `tauri.conf.json` to restore native system window chrome.
  - Converted custom titlebar into standard in-app `.top-bar` with brand, quick search, and actions.
- ✅ **Mihon-Style Floating Bottom Navigation**:
  - Implemented floating pill design with 4px corner radius, backdrop blur, elevation shadow, and safe bottom content padding.
- ✅ **Page-Fitting Settings Cards**:
  - Removed fixed 720px left-aligned constriction, expanding settings panels to 100% full width of the container.
- ✅ **Wiki & Root Documentation Synchronization**:
  - Fully rewrote and synchronized all 19 wiki pages (`wiki/*.md`), `README.md`, `ROADMAP.md`, `TODO.md`, and `.agents/` configs to match current NH Reader state.

### 📌 Completed Session Progress:
- ✅ **Remote Repository Renaming & Links**:
  - Remote renamed to `NH Reader` (`repo slug: NH-Reader`).
  - Local git remote origin updated to `https://github.com/HELIX-Origin/NH-Reader.git`.
  - Updated all markdown documentation, wiki pages, bug trackers, and GitHub issue templates to reference `HELIX-Origin/NH-Reader`.
- ✅ **Track 1: Full UI Localization (Completed — Issue #5 Closed)**:
  - 100% UI localization coverage across all views (225 translation keys, 214 referenced keys, 0 missing).
- ✅ **Track 2: Downloads & Library Polish (+ Portability) (Completed — Issue #6 Closed)**:
  - Download queue persistence across app restarts in `database.sqlite` (`downloads:jobs`).
  - Auto-refresh cache consumers for Popular and Account data (`service://refresh` events).
  - JSON Export and Import for Favorites and Blacklist.
  - Complete portability isolation under `.portable`.
- ✅ **Track 3: Cache Management & Storage Optimization (Completed — Issue #7 Closed)**:
  - Configurable storage budgets (500 MB to Unlimited).
  - Background LRU image cache pruning in `image_cache.rs` and `service.rs`.
  - SQLite `VACUUM` compaction and isolated API response cache purging.
  - Real-time disk storage telemetry in Settings.
- ✅ **Track 5: Mobile Support — Android (Completed — Issue #9 Closed)**:
  - Tauri 2 Android tooling wired (`package.json`, `tauri.conf.json`, `mobile:android:*`).
  - Isolated desktop-only tray and single-instance plugins via `#[cfg(desktop)]` guards.
  - Documented Android APK sideloading instructions. iOS is not supported and has been dropped.
- ✅ **Track 4: UI Consistency & Polish Audit (Completed — Issue #8 Closed)**:
  - Normalized design system tokens in `tokens.css` with nhentai dark palette (`#141414` / `#1f1f1f` / `#ed2553`).
  - Resolved missing token declarations (`--text-soft`, `--text-sm`, `--text-xs`, `--radius-md`).
  - WCAG AA compliant text contrast.
  - Mihon-style bottom navigation ergonomics, active pill indicator geometry, and safe-area inset compatibility.
  - Mobile 2-column grid scaling and touch-friendly card favoriting.
- ✅ **Dynamic UI Scaling & Zero-Empty-Card Layout**:
  - Added `dynamicScaling: boolean` to `SettingsState` and `settings.svelte.ts` (default: enabled).
  - Wired Dynamic UI Scaling switch and description into `SettingsView.svelte` Appearance section with full i18n support.
  - Implemented dynamic column calculation (`cols`) based on container width and full-row fitting (`Math.floor(visible.length / cols) * cols`) in `GalleryGrid.svelte`.
  - Added `.grid.dynamic` CSS styling in `app.css` using `repeat(var(--grid-cols, 5), minmax(0, 1fr))` ensuring cards dynamically scale to fit the window with zero empty card spaces.
- ✅ **All 5 Roadmap Issues & Bugs Closed on Remote**:
  - Issue #4 (Resource Packaging) closed.
  - Issue #5 (Track 1: Full UI Localization) closed.
  - Issue #6 (Track 2: Downloads & Library Polish) closed.
  - Issue #7 (Track 3: Cache Management & Storage) closed.
  - Issue #8 (Track 4: UI Consistency & Polish Audit) closed.
  - Issue #9 (Track 5: Mobile Support) closed.

### Completed Milestone Releases:
- ✅ **[v0.6.1](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.6.1) released 2026-10-01** (Multi-platform portable archives for Windows/macOS/Linux, official app icon bitmaps, NSIS text legibility fix, CI matrix platform isolation & pinned Android NDK)
- ✅ **[v0.6.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.6.0) released 2026-10-01** (Dedicated Library tab, offline archive reader, official archive API downloads, Login modal, native system title bar, Mihon floating bottom bar, squircle design) — gates green: `cargo test` 7/7, `npm run check` 0/0, `npm run i18n:check` 258/258, `npm run check:agents` 51/51 files clean.
- ✅ **Native installer customization & free code signing (v0.5.0 follow-up)**: Tauri native packaging with custom NSIS template (`hooks.nsh`), self-signed code signing certificate (`nh-desktop-codesign.pfx`), `npm run sign:windows`, and installer docs.
- ✅ **[v0.5.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.5.0) released 2026-09-30** (Native Tauri packaging [NSIS both/per-user/per-machine and WiX MSI], portable mode [.portable marker + data/ runtime isolation]) — gates green: `cargo test` 6/6, `npm run check` 0/0, `npm run i18n:check` 31/31, `npm run check:agents` whole tree clean, `npm run build`
- ✅ **v0.4.0 released 2026-09-30** (dedicated uninstaller executable + HELIX Origin publisher attribution + drop-in localization + DB poison recovery) — gates
  green: `cargo test` 10/10, `npm run check` 0/0, `npm run i18n:check` 78/78, `npm run check:agents` whole tree clean, `npm run build`,
  `npm run build:installer` produced `NH Desktop-Setup-0.4.0-win-x64.exe` and `uninstall.exe`
- ✅ **v0.3.0 released 2026-09-25** (M9.1 localization + installer launch fix + titlebar search) — gates
  green: `cargo test` 9/9, `npm run check` 0/0, `npm run i18n:check` 3/3, `npm run build`,
  `npm run build:installer` produced `NH Desktop-Setup-0.3.0-win-x64.exe`

## ✅ M9.1 — Localization core (shipped)

- ✅ i18n infrastructure: locale store, `t()` helper with English fallback, system-locale detection
  (new `get_system_locale` command via `sys-locale`)
- ✅ Language selector in the installer's *Options* step
- ✅ Language selector in `Settings → Appearance → Language`
- ✅ `t()` wired through the app shell (titlebar, sidebar, account chip) and the full installer
- ✅ Validator `npm run i18n:check` (missing / untranslated / unknown keys), fully offline
- ✅ Contributor documentation: [Localization](../../wiki/Localization) (improve existing pack + add new language,
  with free terminology cross-reference resources), linked from Home / Settings / Installation
- ✅ Default pack: `en` (hand-rolled source) — 78/78 keys with 100% drop-in architecture

## ⬜ M9.2 — Remaining language packs (planned, not started)

Deferred to community contributions — packs are 100% drop-in. Adding a language simply requires
dropping `<locale>.json` into `src/lib/i18n/` without editing any code or registries.
Run `npm run i18n:check` to validate.

| # | Pack | Code | Notes |
| --- | --- | --- | --- |
| 1 | Korean | `ko` | High-content language on nhentai; first candidate |
| 2 | Spanish | `es` | Large reader base; `es-419` can be a follow-up split |
| 3 | French | `fr` | Mind non-breaking space before `:` |
| 4 | German | `de` | Straightforward |
| 5 | Russian | `ru` | Straightforward |
| 6 | Portuguese | `pt` | Decide `pt` vs `pt-BR` at registration |
| 7 | Italian | `it` | Straightforward |
| 8 | Thai | `th` | Straightforward |
| 9 | Vietnamese | `vi` | Straightforward |
| 10 | Indonesian | `id` | Straightforward |
| 11 | Polish | `pl` | Straightforward |
| 12 | Dutch | `nl` | Straightforward |
| 13 | Turkish | `tr` | Straightforward |
| 14 | Arabic | `ar` | **Requires an RTL pass first** (see below) |

Dependency: Arabic (`ar`) needs an RTL layout pass — `dir="rtl"` on the app root, mirrored
titlebar/window controls/sidebar, and flipped directional icons — before the pack is meaningful.
Hebrew (`he`) is not currently registered; add it alongside Arabic if an RTL pack is taken.

Also deferred, independent of the packs above:

- ⬜ Extend `en.json` and wrap the remaining untranslated strings — `SettingsView.svelte`
  (account panel, reader, downloads, background services, data), plus the Search, Blacklist,
  Downloads, Reader, and Gallery-detail views. Done opportunistically as each view is touched.
- ⬜ Per-locale date and number formatting (`relativeDate` / `formatCount` in `src/lib/format.ts`
  currently assume English conventions).

## ✅ M1 — Done

- ✅ CSP tightened (`img-src` for nhentai `t.`/`i.` hosts + data:/blob:, IPC `connect-src`, `devCsp` for Vite HMR) — verified with `npm run check` 0/0
- ✅ Scaffold Tauri 2 + SvelteKit (static SPA) project — template generated
- ✅ Rust: `nh_desktop.rs` API client (`reqwest`): gallery, search, new/popular/tagged lists, related, tag info, image proxy
- ✅ Rust: types (`Gallery`, `Tag`, `SearchResponse`, …) with serde + frontend-consistent shape (`src/lib/types.ts`)
- ✅ Rust: `error.rs` — friendly error type, no panics across command boundary
- ✅ Rust: `commands.rs` — 43 commands incl. `fetch_gallery`, `search_galleries`, `fetch_new`, `fetch_popular`, `fetch_tagged`, `fetch_tag_info`, `proxy_image`, `download_gallery`, favorites/blacklist/api-key/db, and the `service_*` background-service commands
- ✅ Rust: throttle for API calls (`THROTTLE` + `tokio::time::sleep` in `nh_desktop.rs`) with ioredis-mock-style cache (frontend `cache.ts`)
- ✅ Frontend: `src/lib/api.ts` + `client.ts` (typed invoke wrapper) + `query.ts` query builder
- ✅ Frontend: stores — settings, library (favorites/history), blacklist, account (runes +
  SQLite-backed cache via `src/lib/cache.ts`)
- ✅ Frontend: design tokens (CSS variables; dark + light themes live, system-aware via
  `settings.svelte.ts`)
- ✅ Frontend: app shell — sidebar nav (Latest, Popular, Favorites, History, Blacklist, Settings) + frameless child-window handling
- ✅ Frontend: `GalleryCard` + `GalleryGrid` with lazy images + image-proxy fallback
- ✅ Frontend: Latest (Home) + Popular views with pagination
- ✅ Frontend: Search view — filter drawer (query, language, category, tags include/exclude, page ranges, sort)
- ✅ Frontend: query builder → nhentai search syntax, `-tag:`/exclude wiring (`buildQuery` + `src/lib/query.ts`)
- ✅ Frontend: Blacklist view — manage tags/text, hide/blur mode, master toggle, server-side excludes
- ✅ Frontend: Favorites + History views
- ✅ Frontend: Gallery detail + reader (paged thumbnails, strip mode, preload, fullscreen)
- ✅ Background service (`src-tauri/src/service.rs`): throttled worker queue — gallery downloads
  (zip → disk, with progress), image prefetch, cache/image maintenance, account sync, Popular
  auto-refresh (off / 15 min / 1 h / daily); live `service://job` + `service://refresh` events
- ✅ Frontend service store (`src/lib/stores/service.svelte.ts`) + Settings "Background services"
  panel: auto-refresh toggle + interval presets, Sync account, Run maintenance, Recent jobs list
- ✅ Rust disk image cache (`src-tauri/src/image_cache.rs`, `cache/images`) backing `proxy_image`
  (cache-first; pruned by service maintenance)
- ✅ Single-instance support (`tauri-plugin-single-instance`): a second launch focuses the
  running window instead of spawning a duplicate
- ✅ Fixed image loading — absolute URLs now derived correctly from API v2 relative paths
  (`image.ts` `pagePath`/`thumbPath`/`avatarUrl`); image hosts accepted as any `*.nhentai.net`
  (incl. `static.nhentai.net` avatars) + matching CSP `img-src`
- ✅ Fixed sign-in status — topbar chip reflects `keyStatus.configured` (username / "Connected" /
  "Sign in") instead of a possibly-failed user fetch
- ✅ App icon wired everywhere: `static/favicon.png`, sidebar + installer brand marks, and the
  installer/maintenance window icons via `default_window_icon()`
- ✅ Static dev port 14440 (Vite + `tauri.conf.json`); removed `scripts/dev.mjs` auto-incrementing
- ✅ End-to-end installer verification: run `npm run build:app` and smoke-test generated installer executables (M8)
- ✅ Docs: this pass — TODO/ROADMAP/BUGS/CHANGELOG/README/AGENTS + wiki updated to match

## ⬜ Backlog / Future Enhancements

- ⬜ Reader preload distance setting & image quality selector (M8 follow-up)
- ⬜ Community language packs (Korean `ko`, Spanish `es`, etc.) via drop-in `src/lib/i18n/*.json`

## 🔁 Recurring

- ⬜ Run `npm run check` + `cargo check`/`test` before any task is marked done.