# ROADMAP.md

> Product direction and milestones for **NH Reader**. This is the "what / why" doc —
> pair it with `TODO.md` (executable tasks) and `BUGS.md` (known issues).

## 🔭 Vision

A fast, lightweight client for nhentai.net that makes the site's weakest areas its
strengths: **search that actually works** and a **blacklist you can trust**. The app is
deliberately lightweight (Tauri + local storage, no server, no accounts) and respects the
public API — we fetch data, we don't scrape aggressively.

## 🧭 Positioning principles

1. 🔍 **Filtering first.** Every view shares the same powerful filter engine.
2. **Blacklist without compromise.** Global, persistent, instant, and toggle-able; it must
   never silently break the grid or the reader.
3. **Fast and light.** SPA on Tauri; images load lazily; requests throttled.
4. **Local & private.** Favorites, history, blacklist, and settings live only on-device.

## 🚫 Non-goals

- **Third-party cloud accounts or hosted sync.** Everything remains 100% on-device and private.
- **Scraping private endpoints or bypassing rate limits.** The app respects upstream API throttling and public endpoints.

## 🗺️ Milestones

| # | Milestone | Status | Release | Scope |
| --- | --- | --- | --- | --- |
| M1 | Foundation | ✅ Shipped | [v0.1.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.1.0) | Scaffold, green toolchain, Rust client (`nh_desktop.rs`), CSP hardening, app shell, design tokens, stores, base views |
| M2 | Browse & discover | ✅ Shipped | [v0.1.1](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.1.1), [v0.2.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.2.0) | Home (new releases), popular, gallery grid/cards, pagination, lazy images with proxy fallback, platform-tagged packaging |
| M3 | Search & filters | ✅ Shipped | [v0.2.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.2.0) | Query builder, filter drawer (text, language, category, per-type tag include/exclude, page ranges, sort), results + count |
| M4 | Global blacklist | ✅ Shipped | [v0.2.1](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.2.1) | Manage panel, server-side `-tag:` excludes, client-side hide/blur, master toggle, titlebar stabilization |
| M5 | Library & local persistence | ✅ Shipped | [v0.3.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.3.0) | Favorites, history, SQLite-backed cache, DB poison recovery, JSON export/import |
| M6 | Reader | ✅ Shipped | [v0.3.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.3.0), [v0.4.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.4.0) | Gallery detail, paged thumbnails, strip mode, fullscreen, responsive reader |
| M7 | Background services & downloads | ✅ Shipped | [v0.4.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.4.0), [v0.5.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.5.0) | Throttled background worker queue (`service.rs`: zip downloads, prefetch, maintenance, auto-refresh), Downloads page, queue persistence |
| M8 | Native packaging & portability | ✅ Shipped | [v0.4.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.4.0), [v0.5.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.5.0) | Tauri native packaging, NSIS dual-scope installer, WiX MSI, dedicated uninstaller, standalone portable mode with `.portable` runtime isolation |
| M9 | Localization core | ✅ Shipped | [v0.3.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.3.0) | Drop-in i18n architecture, LocaleCatalog, English default pack, OS fallback, installer + Settings language pickers, `i18n:check` validator |
| M10 | Cache management & storage optimization | ✅ Shipped | [v0.6.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.6.0) | Configurable disk storage budget (500 MB – Unlimited), background LRU image cache pruning, database compaction (`VACUUM`), dynamic UI scaling with zero empty cards |
| M11 | Upstream API alignment & offline library hub | ✅ Shipped | [v0.6.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.6.0) | Official archive API downloads (`POST /api/v2/galleries/{id}/download`), dual-mode Login Modal, dedicated Library navigation tab (`/library`) with offline archive reader (zip/cbz extraction), Mihon-style floating bottom bar |
| M12 | Multi-Platform, Mobile Toolchain & Community i18n | ✅ Shipped | [v0.7.3](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.7.3) | All 17 complete language packs (279/279 keys), per-locale formatting, reader preload distance (1-5 pages), image quality selector, CBZ direct export from reader toolbar, Arabic RTL layout polish, custom title bar with per-OS window controls (macOS traffic lights, Windows/Linux framed squircles) & positioning setting, restored system tray minimize-on-close, multi-platform portable archives (Windows/macOS/Linux), Android and iOS toolchains, manual platform builds and signing, in-repo docs with live translation, per-platform Tauri configs |

## 📌 Milestone M12 Delivery (v0.7.3)

Driving checklist lives in `TODO.md`. M12 scope items:

- ✅ **All 17 Language Packs at 100% Parity**: Hand-rolled translations for `ja`, `zh-CN`, `zh-TW`, `ko`, `es`, `fr`, `de`, `ru`, `pt`, `it`, `th`, `vi`, `id`, `pl`, `nl`, `tr`, and `ar` with 279/279 keys covered (validated via `npm run i18n:check`).
- ✅ **Per-Locale Date and Number Formatting**: Upgraded `src/lib/format.ts` to use browser standard `Intl.NumberFormat`, `Intl.DateTimeFormat`, and `Intl.RelativeTimeFormat`, reactively bound to `locale.value`.
- ✅ **Reader Preload Distance**: Configurable preload buffer (`1`, `2`, `3`, `5` pages) dynamically sizing reader slice buffering ahead and behind for instant transitions.
- ✅ **Image Quality Selector**: User toggle between `Original (High)` (full-resolution streaming from `IMAGE_HOST`) and `Data Saver (Fast)` (compressed preview thumbnails from `THUMB_HOST` for bandwidth conservation).
- ✅ **Reader Toolbar Quick Controls & CBZ Direct Export**: Quality cycle button with `Q` hotkey, and direct CBZ export button (`E` hotkey) with background worker queue integration and live progress tracking.
- ✅ **Arabic RTL Layout Polish (M9.2 RTL Phase)**: Added `isRTL` and `dir` getters to `locale.svelte.ts`, document-level `dir="rtl"` reactivity, Arabic typography font fallbacks (`Segoe UI Arabic`, `Noto Sans Arabic`, `Tahoma`), mirrored drawer animations, switch toggle knobs, and RTL search alignments.
- ✅ **Custom Title Bar with Per-OS Window Controls**: Disabled native OS decorations in `tauri.conf.json` (`"decorations": false`) in favor of an integrated custom title bar. Built dedicated `WindowControls.svelte` supporting per-OS glyphs: native macOS traffic lights on the left revealing inner glyphs on hover, and Windows/Linux shrunken squircle-framed controls (24×22px, 5px radius) with line, square/stacked, and X glyphs. Highlight effects respect custom Linux desktop themes.
- ✅ **Customizable Window Controls Position**: Added `windowControlsPosition` setting (`Auto`, `Left`, `Right`) under Appearance settings in `SettingsView.svelte`, allowing users on Linux and custom desktop environments to align window buttons with their system conventions.
- ✅ **Window Dragging & Maximize Toggle**: Configured window dragging across empty title bar regions and double-click to toggle maximize/restore. Added `core:window:allow-is-maximized` permission for reactive icon and tooltip updates.
- ✅ **Restored System Tray & Minimize-to-Tray on Close**: Restored `api.prevent_close()` and `let _ = window.hide();` in `WindowEvent::CloseRequested` within `src-tauri/src/lib.rs` to allow the window close button to minimize the app into the system tray without terminating background services, while preserving full application quit via the tray menu.
- ✅ **Multi-Platform Portable Packages (Windows, macOS, Linux)**: Standalone portable archives (`NHReaderPortable_Windows_x64.zip`, `nh-reader_portable_linux_x86_64.tar.gz`, `NHReaderPortable_macOS.zip`) sharing root `.portable` marker and isolated `./data/` folder, with ancestor traversal in `src-tauri/src/lib.rs`.
- ✅ **Universal Portable Launcher Scripts**: Standalone launcher scripts `scripts/launch-linux.sh`, `scripts/launch-macos.command`, and `scripts/launch-windows.bat`.
- ✅ **NSIS Theme & Contrast Alignment**: Configured coordinated text and background colors in `src-tauri/windows/hooks.nsh` to eliminate black-on-dark unreadable text and preserve dark DWM title bars.
- ✅ **Official App Icon Installer Bitmaps**: Generated crisp 150×57 `header.bmp` and 164×314 `sidebar.bmp` assets directly from `icon.png` via `scripts/generate-installer-bitmaps.ps1`.
- ✅ **Restored Mobile Toolchain & CI Android Split APKs**: Restored Android (`mobile:android:*`) and iOS (`mobile:ios:*`) scripts in `package.json` with manual build wiki documentation; added dedicated CI packaging job generating separate split APKs per architecture (`aarch64`, `armv7`, `x86_64`) with pre-installed NDK discovery and dry-run support.
- ✅ **In-Repo Documentation with Live Translation**: Migrated documentation into repository `docs/` folder (`docs/README.md`) with in-page Google Translate dropdown widget (`docs/translate.js`) supporting all 18 languages.
- ✅ **GitHub Discussions Release Announcements**: Seeded release announcements for all historical versions (`v0.1.0` – `v0.6.0`) in `.github/discussions/announcements/` and created standardized announcement template (`.agents/templates/release-announcement.md`).
- ✅ **Per-Platform Tauri Configs & Node.js 26**: Added `tauri.<platform>.conf.json` platform configurations and upgraded CI packaging workflow to Node.js 26.

## 📌 Historical Milestones & Shipped Releases (M1 – M11)

### Milestone M11: Upstream API Alignment & Offline Library Hub ([v0.6.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.6.0))
- **Official Archive Downloads**: Adopted dedicated `POST /api/v2/galleries/{id}/download` endpoint as advised in official API documentation, eliminating page-by-page CDN crawling.
- **Dedicated Account Login Modal**: Comprehensive dual-mode authentication modal supporting official API Keys (bypasses Cloudflare CAPTCHAs) and direct credentials, with live account status display.
- **Primary Library Navigation Tab**: Added `/library` bottom navigation item serving as the central hub for local and offline doujins.
- **Direct Reading from Downloaded Archives**: Backend zip/cbz extractor commands (`get_downloaded_gallery_page`, `get_downloaded_galleries`, `delete_downloaded_gallery`) enabling offline reading directly from downloaded archives without network requests.
- **Library Downloaded Favorites Isolation**: Dedicated filtering for downloaded favorites (`isDownloaded(id)`) within the Library view, keeping it decoupled from the general `/favorites` tab.
- **Mihon-Style Floating Bottom Navigation**: Elevated floating bottom bar with squircle corners, backdrop blur, and safe content padding.
- **Full-Width Settings Layout**: Expanded settings cards to span the full page width, eliminating left-aligned constriction.

### Milestone M10: Cache Management & Storage Optimization ([v0.6.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.6.0))
- **Storage Budget Controls**: Configurable disk storage budgets (500 MB, 1 GB, 2 GB, 5 GB, Unlimited) in settings.
- **Background LRU Cache Pruning**: Automatic background LRU cache pruning in `image_cache.rs` and `service.rs`, evicting oldest files down to 85% of budget.
- **Compaction & Clean Purging**: SQLite `VACUUM` compaction and isolated API response cache purging without wiping user data (`db.rs`, `cache.ts`).
- **Dynamic UI Scaling**: Adaptive column calculation and full-row fitting (`GalleryGrid.svelte`) ensuring cards dynamically scale to fit the window with zero empty card spaces.

### Milestone M9: Localization Core ([v0.3.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.3.0))
- **Drop-in i18n Architecture**: Locale store, `t()` helper, system-locale detection (`get_system_locale`), `npm run i18n:check` validator, and complete English default pack.
- **Installer & Settings Pickers**: Language selection in NSIS installer and Settings view.

### Milestone M8: Native Packaging & Portability ([v0.4.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.4.0), [v0.5.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.5.0))
- **Tauri Native Packaging**: Migrated from custom webview installer to Tauri 2's native packaging toolchain with NSIS hooks (`hooks.nsh`).
- **Dual Installation Scopes**: Support for per-user (local AppData without elevation) and per-machine (administrative Program Files) targets.
- **Standard Windows Uninstaller**: Automatically registers uninstaller in Windows "Installed apps" / "Add or remove programs", offering to preserve local user data.
- **Enterprise WiX MSI & Free Code Signing**: WiX `.msi` installers and PowerShell code signing script (`scripts/sign.ps1`) utilizing local code-signing certificates.

### Milestone M7: Background Services & Downloads ([v0.4.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.4.0), [v0.5.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.5.0))
- **Background Worker Queue**: Throttled worker queue (`service.rs`) for gallery downloads (zip/cbz), image prefetch, cache maintenance, account sync, and periodic Popular auto-refresh.
- **Live Event Streaming**: `service://job` and `service://refresh` events piped to frontend runes store.
- **Queue Persistence**: SQLite-backed download queue persistence across app restarts.
- **Dedicated Downloads View**: Download progress monitoring, format selection, and open folder actions.

### Milestone M6: Reader ([v0.3.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.3.0), [v0.4.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.4.0))
- **Gallery Detail & Reader**: Paged thumbnails, continuous vertical strip mode, and responsive fullscreen reading.
- **Keyboard Navigation**: Arrow keys, Page Up/Down, Home/End, and quick controls hotkeys.

### Milestone M5: Library & Local Persistence ([v0.3.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.3.0))
- **Favorites & History**: On-device favorites bookmarking, reading history tracking with last-page recovery, and local SQLite persistence.
- **Poison-Recovered DB Locks**: Resilient SQLite transaction handling recovering safely from mutex panics.
- **Data Export & Import**: JSON export and import for favorites and blacklisted tags.

### Milestone M4: Global Blacklist ([v0.2.1](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.2.1))
- **Blacklist Management**: Tag and keyword exclusion panel with add/remove controls.
- **Dual-Layer Filtering**: Server-side `-tag:` query exclusions combined with client-side hide/blur grid masking and master toggle.

### Milestone M3: Search & Filters ([v0.2.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.2.0))
- **Search Query Builder**: Full query builder supporting nhentai search syntax.
- **Filter Drawer**: Multi-criteria filtering by text query, language, category, per-type tag inclusions/exclusions, page ranges, and sorting.

### Milestone M2: Browse & Discover ([v0.1.1](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.1.1), [v0.2.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.2.0))
- **Home & Popular Views**: Real-time browsing of newest releases and popular galleries with pagination.
- **Card Grid & Lazy Images**: Responsive gallery cards with lazy loading and Rust image proxy fallback (`proxy_image`).

### Milestone M1: Foundation ([v0.1.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.1.0))
- **Scaffold & Architecture**: Tauri 2 + SvelteKit static SPA (`adapter-static`), Svelte 5 runes, TypeScript strict.
- **Rust Client**: Throttled `nh_desktop.rs` API client (`reqwest`), 26 Tauri commands, error handling.
- **Design System & Shell**: Pure CSS design tokens (`tokens.css`, `base.css`), dark theme, sidebar navigation.
- **Security**: Hardened CSP allowlisting `*.nhentai.net`, IPC-only network boundaries.

## 🚫 Dropped Features

- **Theme Engine**: Dropped by architectural decision. NH Reader does not support multi-theme engines or custom skins; it strictly standardizes on nhentai.net's native dark color scheme (`#141414` / `#1f1f1f` / `#ed2553`). All multi-theme code/issues are permanently dropped.
- **Automated Mobile CI Packaging**: Dropped from GitHub Actions CI workflow to ensure runner stability. Mobile builds are supported and built locally via Tauri CLI.

## 🔁 Recurring themes (applies to every milestone)

- 🐢 Rate-limit and cache requests; single-flight duplicate requests.
- Images always lazy; degraded gracefully when the CDN 404s.
- Accessibility: keyboard navigation for filters, focus states, reduced motion.
- Testing: svelte-check strictness + Rust unit tests on query building and URL mapping; filter-query round-trip is a permanent invariant.

## 📅 Review cadence

- 📝 ROADMAP.md is updated whenever scope changes, a milestone completes, or a decision log entry lands in `AGENTS.md`.
- Everything in ROADMAP traces to `TODO.md` items; orphaned items get cleaned up.