# What is NH Reader?

**NH Reader** is a lightweight, modern, cross-platform client for the adult manga archive nhentai.net. It is not a website clone: it ships a custom UI, Mihon-inspired thumb-friendly navigation, **Dynamic UI Scaling**, and a materially better **search/filter** and **global blacklist** experience than the site can offer, backed by the site's own public API and imported metadata (galleries, tags, languages, categories, artists, characters, parodies).

- 👋 **Browse & discover** — New (home), Popular, tag pages, everything lazy-loaded with image-proxy caching.
- 📐 **Dynamic UI Scaling** — window-adaptive column calculation and row fitting so there is never an empty card space.
- 📱 **Mihon-style floating bottom navigation** — thumb-friendly, floating bottom bar with a 4px corner radius and elevated backdrop blur, optimized for touch screens and desktop displays alike.
- 🪟 **Native window chrome & in-app top bar** — native OS decorations with window titlebar, coupled with an in-app top bar for branding, quick search, blacklist badge, and account controls.
- 🔍 **Search that actually works** — a filter drawer (text, language, category, per-type tag include/exclude, page ranges, six sorts) compiled into native nhentai query syntax, so you can cut a giant haystack down to exactly what you want.
- 🛡️ **A blacklist you can trust** — global, persistent, applied server-side (`-tag:` excludes) *and* client-side (hide/blur), with a master toggle. It never silently breaks the grid.
- 🔒 **Private by default & versatile account sync** — no accounts required, no servers, no telemetry. Favorites, history, blacklist, and settings are stored locally in an ambiguous `database.sqlite` database. An optional account sign-in modal supports both official API Keys (bypasses Cloudflare CAPTCHAs) and direct credentials for live profile rendering and server-synced blacklists.
- 📦 **Native packaging** — platform-native NSIS and WiX MSI installers on Windows (supporting both per-user and per-machine scopes), DMG on macOS, deb/AppImage on Linux, APK on Android.
- 🌐 **Speaks your language** — the interface defaults to your system language and can be changed in Settings. Complete 100% UI localization with automatic fallback to your system locale and drop-in language packs for community contributions. See **[Localization](Localization)**.
- ⚡ **Official archive downloads & background services** — official pre-built gallery archives via `POST /api/v2/galleries/{id}/download` (ZIP/CBZ with streaming progress), background image prefetch, LRU cache eviction down to 85% of storage budget, SQLite `VACUUM` compaction, account sync, and periodic Popular refreshes.

> **18+ only.** This software is for adults. You confirm you are of legal age to view adult
> content. See the [Terms of Service](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md).

## 📦 Platform support

| Platform | Status | Distribution Formats |
| --- | --- | --- |
| Windows 10+ | ✅ Supported | NSIS setup (`.exe`), WiX MSI (`.msi`), Portable (`.zip`) |
| macOS 10.13+ | ⚠️ Toolchain supported | DMG image (`.dmg`), App bundle (`.app`) *(untested)* |
| Linux (x86_64) | ✅ Supported | Debian package (`.deb`), AppImage (`.AppImage`) |
| Android | ⚠️ Toolchain supported | Sideloadable Android package (`.apk`) *(untested)* |

> [!WARNING]
> **Platform Testing Notice (Android & macOS):** The maintainer does not possess physical macOS or Android test hardware. While Tauri 2 build toolchains are configured and output valid binaries, **Android and macOS builds are currently untested**. Feedback and testing reports from community members are welcome!

## 🧭 Getting around

- **[Getting Started](Getting-Started)** — first run, API key, what to expect.
- **[Installation & Maintenance](Installation-and-Maintenance)** — installing, updating, uninstalling, portable mode, and mobile sideloading.
- **[Search & Filters](Search-and-Filters)** — the query engine, full reference.
- **[Blacklist](Blacklist)** — the blacklist, in depth.
- **[Reader & Galleries](Reader-and-Galleries)** — detail pages and the reader.
- **[Localization](Localization)** — changing the app language, and adding a new one.
- **[Architecture](Architecture)** — how the pieces fit together.

## 💡 Quick facts

- Stack: **Tauri 2 (Rust `reqwest`)** backend + **SvelteKit static SPA** (Svelte 5 runes, strict TypeScript) + **plain CSS design tokens** (no UI framework).
- Persistence: SQLite-backed KV cache (`src/lib/cache.ts` → `database.sqlite`) for favorites, history, blacklist, settings and the API key, plus an on-disk image cache (`cache/images`) and a `downloads/` folder.
- Rebranded & Decoupled: Product is **NH Reader** — `NH Reader.exe`, window title "NH Reader", identifier `net.nh-reader.client`, database `database.sqlite`.

## 🔗 Links

- [Repository](https://github.com/HELIX-Origin/NH-Reader)
- [Releases](https://github.com/HELIX-Origin/NH-Reader/releases)
- [Changelog](https://github.com/HELIX-Origin/NH-Reader/blob/main/CHANGELOG.md)
- [Privacy](https://github.com/HELIX-Origin/NH-Reader/blob/main/PRIVACY.md)
- [Terms](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md)
- [Security](https://github.com/HELIX-Origin/NH-Reader/blob/main/SECURITY.md)
- [nhentai.net](https://nhentai.net) — the site this client talks to.