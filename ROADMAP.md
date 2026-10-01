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

| # | Milestone | Status | Scope |
| --- | --- | --- | --- |
| M1 | Foundation | ✅ Shipped | Scaffold, green toolchain, Rust client + 45 commands, CSP, app shell, tokens, stores, all views |
| M2 | Browse & discover | ✅ Shipped (core) | Home (new releases), popular, gallery grid/cards, pagination, lazy images with proxy fallback |
| M3 | Search & filters | ✅ Shipped (core) | Query builder, filter drawer (text, language, category, per-type tag include/exclude, page ranges, sort), results + count |
| M4 | Global blacklist | ✅ Shipped (core) | Manage panel, server-side `-tag:` excludes, client-side hide/blur, master toggle |
| M5 | Library & Offline Reader | ✅ Shipped | Dedicated Library navigation tab with downloaded doujins shelf, direct reading from downloaded zip/cbz archives, download removal, and integrated Favorites/History tabs |
| M6 | Reader | ✅ Shipped (core) | Gallery detail, paged thumbnails, strip mode, preload, fullscreen |
| M7 | Downloads & background services | ✅ Shipped | Background-service worker queue (zip/cbz/torrent downloads to disk with progress, image prefetch, cache/image maintenance, account sync, Popular auto-refresh with job events); per-gallery Download button + Downloads page; queue resume/persist across restarts; JSON export/import; configurable cache storage budget and vacuum compaction |
| M8 | Polish / release | ✅ v0.4.0 & v0.5.0 shipped | [Release 0.5.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.5.0) shipped 2026-09-30 (native Tauri packaging with NSIS both/per-user/per-machine and WiX MSI on Windows, DMG on macOS, deb/AppImage on Linux, and portable mode with `.portable` runtime isolation); [Release 0.4.0](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v0.4.0) shipped 2026-09-30 (dedicated uninstaller executable, HELIX Origin publisher attribution, poison-recovered DB locks, drop-in localization architecture) |
| M9 | Localization & language packs | ✅ Shipped (Core + UI) | 100% drop-in hand-rolled architecture with LocaleCatalog, English default with OS fallback, installer + Settings language pickers; 100% full UI localization across all views (217 keys). Community packs open for contribution |
| M11 | Upstream API Alignment & UI Refinements | ✅ Shipped | Official archive downloads via `POST /api/v2/galleries/{id}/download`, dedicated dual-mode Login Modal (API Key & Credentials), reactive account state getters, native OS window title bar, Mihon-style floating bottom bar (4px radius), and full-width settings cards |

## 🎯 Current focus & Update Tracks

Active development is organized into tracks:

### Track 9: Library Downloaded Favorites Isolation (✅ Shipped)
- **Downloaded Favorites Scope**: The Library's "Favorites" tab strictly filters and displays downloaded favorites (`isDownloaded(id)`), ensuring the Library remains an offline/download hub while the standalone `/favorites` tab continues to display all favorites across the library.
- **Dedicated Count Badges & States**: Dedicated counts and localized empty states for downloaded favorites in the Library view.

### Track 8: Clean Window Exit & Refined Rounded Square Radiuses (✅ Shipped)
- **Clean Window Exit & Process Shutdown**: Remove `api.prevent_close()` on the native title bar close button and eliminate destructive `window.destroy()` calls, ensuring an orderly process termination without WebView2 `Chrome_WidgetWin_0` Error 1411 or forced SIGINT exits (`0xc000013a`).
- **Refined Rounded Square Radiuses**: Soften the overly strict 4px radius limit to modern small rounded square corners (`8px` - `10px`) across the floating navigation bar, gallery cards, tab switchers, and modals.

### Track 7: Dedicated Library Tab & Direct Offline Archive Reading (✅ Shipped)
- **Library Navigation Tab**: Added `/library` as a primary bottom navigation tab with an open book icon (`book`), serving as the central hub for local and offline doujins.
- **Downloaded Doujins Shelf**: Scan and display all completed downloads (`gallery-{id}.zip`, `gallery-{id}.cbz`) with titles, cover thumbnails, page counts, file formats, and file sizes.
- **Direct Reading from Downloaded Archives**: Backend zip/cbz extractor commands (`get_downloaded_gallery_page`, `get_downloaded_galleries`, `delete_downloaded_gallery`) enabling offline reading directly from downloaded archives without network requests.
- **Offline Reader Fallback**: Transparently serve pages from downloaded local archives in `ReaderImage.svelte` whenever a download exists, enabling instant and 100% offline reading.
- **Multi-Category Views**: Tabbed organization in the Library view offering quick switching between Downloaded doujins, Favorites, and Reading History.

### Track 6: Upstream API Alignment, Authentication & UI Refinements (✅ Shipped)
- **Official Archive Downloads**: Adopt the dedicated `POST /api/v2/galleries/{id}/download` endpoint as advised in official nhentai API documentation, eliminating page-by-page CDN reconstruction when authenticated.
- **Dedicated Account Login Modal**: Comprehensive dual-mode authentication modal supporting official API Keys (bypasses Cloudflare CAPTCHAs) and direct credentials, with live account status display and disconnect actions.
- **Reactive Account State & Username Display**: Reactive Svelte 5 getters in `getAccountState()`, ensuring real-time username and avatar rendering upon connection.
- **Account Blacklist Isolation**: Strict isolation between user profile and blacklisted tags, ensuring tag IDs are resolved and never mixed with username or `favorite_tags`.
- **Native Window Titlebar & In-App Top Bar**: Restored native system window decorations (`decorations: true`) in `tauri.conf.json`, replacing custom window chrome with an in-app top bar.
- **Floating Mihon Bottom Navigation**: Elevated floating bottom bar with 4px corner radius, backdrop blur, and safe content padding.
- **Full-Width Settings Layout**: Expanded settings cards to span the full page width, eliminating left-aligned constriction.

### Track 1: Full UI Localization (Priority 1 — ✅ Shipped, Issue #5)
- Wrap all remaining hardcoded strings across all views into `locale.t()` calls.
- Views in scope: `SettingsView.svelte`, `DownloadsView` (`routes/downloads/+page.svelte`), `BlacklistView.svelte`, `GalleryDetailView` (`routes/gallery/[id]/+page.svelte`), `ReaderView` (`routes/gallery/[id]/reader/+page.svelte`), `FilterPanel.svelte`, `SearchView` (`routes/search/+page.svelte`), `FavoritesView.svelte`, `HistoryView.svelte`, `GalleryCard.svelte`.
- Expand `src/lib/i18n/en.json` to 100% cover the entire user interface (217 keys, 206 references).
- Validated with `npm run i18n:check`, `npm run check`, and `npm run check:agents`.

### Track 2: Downloads & Library Polish (+ Portability) (Priority 2 — ✅ Shipped, Issue #6)
- Background service download queue persistence across app restarts (SQLite-backed `downloads:jobs` state).
- Wire auto-refresh cache consumers for Popular and Account data (cache invalidation and reactive reload).
- Import / Export favorites and blacklist as portable JSON files (`library.svelte.ts`, `blacklist.svelte.ts`).
- Full portability polish: ensure download folders, databases, and cache strictly respect the portable environment (`.portable` marker and isolated `./data` directory).

### Track 3: Cache Management & Storage Optimization (Priority 3 — ✅ Shipped, Issue #7)
- Configurable maximum disk storage budgets (500 MB, 1 GB, 2 GB, 5 GB, Unlimited) stored in settings.
- Automatic background LRU cache pruning in `image_cache.rs` and `service.rs`, evicting oldest files down to 85% of budget.
- Database compaction (`VACUUM`) and isolated cache clearing without wiping user data (`db.rs`, `cache.ts`).
- Storage telemetry and management controls in `SettingsView.svelte`.

### Track 5: Mobile Support (Android & iOS) (Priority 4 — ✅ Shipped, Issue #9)
- Native mobile build pipelines leveraging Tauri 2's mobile toolchains (`tauri android`, `tauri ios`).
- **Android**: APK / AAB packaging for direct distribution and sideloading (`mobile:android:init` / `mobile:android:build`).
- **iOS**: Provided primarily for Apple Silicon macOS sideloading without requiring a jailbreak. Native iOS builds will be produced via Tauri's native iOS support, allowing sideloading or installation on jailbroken devices.
- **Hardware Testing Status**: Because the primary maintainer lacks physical macOS and Android devices, Android and iOS builds are currently community-supported and untested by the maintainer.
- **Support Disclaimer**: An explicit disclaimer and warning is documented and displayed that **no technical support is provided for users who brick or damage their devices by attempting to jailbreak their phones**.

### Track 4: UI Consistency & Polish Audit (Final Stage — ✅ Shipped, Issue #8)
- Final visual stabilization and layout audit across all views.
- Mihon-style bottom navigation ergonomics, pill indicator dimensions, and responsive layout pass.
- Standardize spacing, padding, margins, font sizing, and contrast.
- Ensure strict adherence to nhentai's dark theme palette (`#141414` / `#1f1f1f` / `#ed2553`).
- Mobile 2-column gallery grid scaling and touch-friendly pointer accessibility.

### 🚫 Dropped Features
- **Theme Engine**: Dropped by architectural decision. NH Reader does not support multi-theme engines or custom skins; it strictly standardizes on nhentai.net's native dark color scheme. All multi-theme code/issues are permanently dropped.

## 🔁 Recurring themes (applies to every milestone)

- 🐢 Rate-limit and cache requests; single-flight duplicate requests.
- Images always lazy; degraded gracefully when the CDN 404s.
- Accessibility: keyboard navigation for filters, focus states, reduced motion.
- Testing: svelte-check strictness + Rust unit tests on query building and URL mapping;
  filter-query round-trip is a permanent invariant.

## 🌍 M9 — Localization & language packs

Goal: full UI localization with language packs for every language nhentai.net tags on content.

- **Phase 1 — M9.1 core (shipped)**: locale store, `t()` helper, system-language detection,
  language selector in installer options and Settings page, `npm run i18n:check` validator, and
  complete default pack for English (source) with 100% drop-in architecture for community translations.
- **Phase 2 — M9.2 remaining packs (planned, not started)**: the other nhentai content languages
  (`ko`, `es`, `fr`, `de`, `ru`, `pt`, `it`, `th`, `vi`, `id`, `pl`, `nl`, `tr`, `ar`). All are
  already registered and selectable with per-key English fallback. Itemised in `TODO.md`;
  contributed opportunistically or via community pull requests. See [Localization](../../wiki/Localization).
- **Phase 3 — M9.2 RTL (planned, not started)**: RTL layout for Arabic, date/number formatting
  per locale, extension of `en.json` to the remaining views.

## 📅 Review cadence

- 📝 ROADMAP.md is updated whenever scope changes, a milestone completes, or a decision log
  entry lands in `AGENTS.md`.
- Everything in ROADMAP should trace to `TODO.md` items; orphaned items get cleaned up.