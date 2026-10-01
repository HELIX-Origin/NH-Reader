# 📢 NH Reader — Release Announcements

Welcome to the **NH Reader** announcements discussion board! This is the official home for per-release updates, detailed feature overviews, and changelogs for the community.

---

## 📑 Release Index

- **[v0.7.0 — Custom Title Bar, Reader Ergonomics, Arabic RTL Polish & Multi-Platform Portability](#v070--2026-10-01)** *(2026-10-01)*
- **[v0.6.0 — Dedicated Library Tab, Offline Archive Reader, API v2 Downloads & Product Rebrand](#v060--2026-10-01)** *(2026-10-01)*
- **[v0.5.0 — Native Tauri Packaging (NSIS & WiX MSI), Portable Mode & Data Isolation](#v050--2026-09-30)** *(2026-09-30)*
- **[v0.4.0 — Dedicated Uninstaller, HELIX Origin Attribution & Drop-in Localization](#v040--2026-09-30)** *(2026-09-30)*
- **[v0.3.0 — Context-Aware Search, Multi-Language UI Core & Setup Polish](#v030--2026-09-25)** *(2026-09-25)*
- **[v0.2.1 — Storage Architecture Hardening & Docs Synchronization](#v021--2026-09-22)** *(2026-09-22)*
- **[v0.2.0 — Custom UI Shell, Background Service Queue & Disk Image Cache](#v020--2026-09-20)** *(2026-09-20)*
- **[v0.1.0 — Initial Foundation Release](#v010--2026-09-15)** *(2026-09-15)*

---

## [v0.7.0] — 2026-10-01
### 🖥️ Custom Title Bar, Reader Ergonomics, Arabic RTL Polish & Multi-Platform Portability

**Release Announcement Discussion:** [announcements/v0.7.0.md](announcements/v0.7.0.md)

NH Reader v0.7.0 brings a beautifully integrated custom title bar with per-OS tailored window controls, restores system tray integration with minimize-to-tray on close, adds configurable reader preload buffering, an image quality selector, and direct CBZ export straight from the reader toolbar. In addition, v0.7.0 delivers all 17 community language packs with 100% key parity (279/279 keys) and full Arabic RTL layout polish, standalone portable archives for Windows, macOS, and Linux with universal launcher scripts, in-repo documentation with live translation, and a hardened CI release pipeline featuring dedicated Android split APKs and true dry-run verification.

---
### 📚 Dedicated Library Tab, Offline Archive Reader, API v2 Downloads & Product Rebrand

We are proud to announce **NH Reader v0.6.0**, our largest feature update yet! This release transitions the application to the official **NH Reader** brand, introduces an all-new dedicated Library hub with direct offline reading from downloaded `.zip` and `.cbz` archives, aligns with the upstream API v2 download endpoint, and delivers significant ergonomics upgrades including a floating Mihon-style navigation bar and native titlebar window decorations.

#### 🌟 Key Highlights

1. **Dedicated Library Tab & Offline Archive Reader (`/library`)**:
   - A primary bottom navigation tab featuring an open book icon (`book`).
   - Dedicated **Downloaded Doujins Shelf** scanning your local downloads directory for completed `.zip` and `.cbz` archives.
   - 100% offline reading: browse, open, and read downloaded archives directly with zero network calls via `ReaderImage.svelte` and `gallery/[id]/reader`.
   - Displays cover thumbnails, titles, page counts, file formats, and file sizes with 1-click "Read" and "Delete" actions.
   - Unified multi-tab library switcher: quickly jump between **Downloaded**, **Favorites** (strictly isolated to downloaded favorites), and **Reading History**.

2. **Official Pre-Built Archive API Downloads**:
   - Replaced page-by-page CDN crawling with upstream API v2's official archive endpoint: `POST /api/v2/galleries/{id}/download?format={format}`.
   - Downloads full ZIP or CBZ archives in a single efficient stream with real-time byte progress, background retries, and task queue persistence across app restarts in `database.sqlite`.

3. **Dedicated Account Login & Authentication Modal**:
   - Introduced `LoginModal.svelte` accessible from the top bar account chip and Settings.
   - Dual authentication tabs: **Official API Key** (recommended, completely bypasses Cloudflare PoW/CAPTCHAs) and **Credentials** (direct username/password authentication via `POST /api/v2/auth/login`).
   - Reactive Svelte 5 account state getters for immediate username and avatar display upon sign-in.

4. **Product Rebrand to NH Reader & `database.sqlite` Migration**:
   - Formalized product identity as **NH Reader** (`NH Reader.exe`, window title `NH Reader`, publisher `HELIX Origin`, identifier `net.nh-reader.client`).
   - Storage migrated to ambiguous `database.sqlite` with automated seamless key migration (`nh-reader:` prefix).

5. **Ergonomic UI Overhaul & Rounded Square Design**:
   - Floating Mihon-style bottom bar with elevated backdrop blur (`rgba(31,31,31,0.92)`).
   - Softened corners to refined rounded squircle radiuses (`8px`–`10px`) across navigation items, cards, badges, and modals.
   - Restored native OS titlebar decorations (`decorations: true`) alongside in-app header controls.
   - Clean window exit lifecycle eliminating WebView2 Error 1411 and exit hangs.

---

## [v0.5.0] — 2026-09-30
### 📦 Native Tauri Packaging (NSIS & WiX MSI), Portable Mode & Data Isolation

**NH Reader v0.5.0** transitions the application to native Tauri 2 packaging, introducing enterprise-grade WiX MSI installers, fully customized NSIS installers with user-selectable scopes, and self-contained portable mode execution.

#### 🌟 Key Highlights

1. **Native Tauri 2 Packaging & Dual Installation Scopes**:
   - Built on Tauri 2's native packaging toolchain with custom NSIS template hooks (`src-tauri/windows/hooks.nsh`).
   - Supports both **Per-User** (`%LOCALAPPDATA%` without requiring administrative UAC prompts) and **Per-Machine** (`Program Files` for all users) installations.
   - Native folder picker (`installer_pick_directory`) allows specifying custom installation destinations across Windows, Linux, and macOS.

2. **Enterprise WiX MSI Installers**:
   - Generates standard `.msi` installers for enterprise and automated system rollouts (`NH Reader_<version>_x64_en-US.msi`).

3. **Standalone Portable Mode**:
   - Pre-packaged standalone portable archive (`.zip`) with `.portable` runtime marker.
   - When `.portable` is detected, all application data (`database.sqlite`, `cache/images`, settings, and downloads) is kept inside `./data` next to the executable.
   - Leaves zero footprint on the host system: no registry writes, no AppData folders, and no leftover shortcuts.

4. **Free Windows Code Signing Pipeline**:
   - Integrated PowerShell code signing script (`scripts/sign.ps1`) and npm command (`npm run sign:windows`) utilizing local code-signing certificates.

---

## [v0.4.0] — 2026-09-30
### 🛡️ Dedicated Uninstaller, HELIX Origin Attribution & Drop-in Localization

**v0.4.0** establishes our robust uninstaller lifecycle, configures official publisher attribution across platform package managers, hardens SQLite database concurrency, and introduces our drop-in localization architecture.

#### 🌟 Key Highlights

1. **Dedicated Uninstaller Binary (`uninstall.exe`)**:
   - Deploys a dedicated uninstaller binary in the program directory.
   - Prevents executable file-locking by relocating to a temporary location during execution, cleanly removing the application directory upon completion.
   - Registers properly in Windows "Installed apps" / "Add or remove programs" under publisher `HELIX Origin`.

2. **Drop-in Localization Architecture**:
   - Zero-dependency `LocaleCatalog` utilizing dynamic Vite glob imports (`./*.json`).
   - Drop-in community translation packs: adding or improving a language requires only editing a single JSON file in `src/lib/i18n/`.
   - Automatic fallback to operating system locale and then to English.

3. **Poison-Recovered SQLite Mutex Locks**:
   - Added `lock_conn()` mutex recovery in `db.rs` to guarantee persistent storage survives thread panics without deadlocking.

4. **Direct Page Download Pipeline**:
   - Downloads doujin pages directly from allowlisted image CDNs into clean `.zip` or `.cbz` archives with real-time per-page progress events.

---

## [v0.3.0] — 2026-09-25
### 🔍 Context-Aware Search, Multi-Language UI Core & Setup Polish

**v0.3.0** expands navigation and search ergonomics with page-aware quick search, ships initial localized language packs, and resolves installer process execution.

#### 🌟 Key Highlights

1. **Context-Aware Titlebar Search**:
   - Quick-search in the top bar dynamically adapts to the active view: filters local results on Favorites/History, updates query parameters on Search, and routes globally from Home.
2. **Localization Foundation & Initial Language Packs**:
   - Initial translations shipped for English, Japanese (`ja`), Simplified Chinese (`zh-CN`), and Traditional Chinese (`zh-TW`).
   - Integrated language selectors into the setup wizard options step and Settings view.
   - Created offline translation validation gate: `npm run i18n:check`.
3. **Installer Lifecycle Fix**:
   - Deferred app launch until after setup wizard completion, preventing premature application startup during installation.

---

## [v0.2.1] — 2026-09-22
### 🔧 Storage Architecture Hardening & Docs Synchronization

**v0.2.1** represents a comprehensive documentation and architecture alignment pass, establishing our formal agent ecosystem and verifiable contracts.

#### 🌟 Key Highlights

- **Persistence Clarification**: Unified documentation to reflect SQLite-backed KV storage (`database.sqlite`) rather than browser `localStorage`.
- **Module Layout Standardization**: Established flat `src/lib/` structure (`api.ts`, `client.ts`, `types.ts`, `query.ts`, `image.ts`, `format.ts`, `cache.ts`) and Svelte 5 runes conventions.
- **Strict Verification Gate**: Introduced `npm run check:agents` ensuring rules, roles, branding, and link integrity across the codebase.
- **Window Controls Direct Binding**: Bound window controls directly to Tauri window APIs for instant response.

---

## [v0.2.0] — 2026-09-20
### ⚡ Custom UI Shell, Background Service Queue & Disk Image Cache

**v0.2.0** delivered the initial custom desktop application shell, background service queue, and high-performance image caching.

#### 🌟 Key Highlights

- **Custom Desktop Shell**: Frameless desktop window with custom traffic light controls, top bar search, and sidebar navigation.
- **Background Worker Service (`service.rs`)**: Throttled async task worker managing download jobs, LRU image maintenance, account synchronization, and periodic Popular feed refreshes.
- **Disk Image Cache (`image_cache.rs`)**: Cache-first proxy fallback serving images from disk cache (`cache/images`) when direct CDN loading encounters rate limits or errors.
- **Single Instance Support**: Enforced single instance execution via `tauri-plugin-single-instance`, focusing the running window when a second instance is launched.

---

## [v0.1.0] — 2026-09-15
### 🚀 Initial Foundation Release

The initial release of the project, establishing the core Tauri 2 + SvelteKit static SPA architecture.

#### 🌟 Key Highlights

- **Core Tauri 2 + Rust Architecture**: High-speed, secure backend powered by `reqwest` talking to nhentai.net public API v2.
- **Throttled Networking**: Respects upstream servers with strict request throttling and rate limiting.
- **Search & Filters**: Comprehensive filter drawer with tag inclusion/exclusion, category filters, and sorting modes.
- **Global Blacklist**: Client-side hide/blur and server-side `-tag:` exclude filtering.
- **Local-First SQLite Persistence**: Private local storage for favorites, reading history, and settings without tracking or telemetry.