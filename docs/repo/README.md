---
source_path: README.md
---
<div align="right">
<details id="translate-menu">
<summary>🌐 Translate this page</summary>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=en" lang="en">English</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=ja" lang="ja">日本語 (Japanese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=zh-CN" lang="zh-CN">简体中文 (Simplified Chinese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=zh-TW" lang="zh-TW">繁體中文 (Traditional Chinese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=ko" lang="ko">한국어 (Korean)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=es" lang="es">Español (Spanish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=fr" lang="fr">Français (French)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=de" lang="de">Deutsch (German)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=ru" lang="ru">Русский (Russian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=pt" lang="pt">Português (Portuguese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=it" lang="it">Italiano (Italian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=th" lang="th">ไทย (Thai)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=vi" lang="vi">Tiếng Việt (Vietnamese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=id" lang="id">Bahasa Indonesia (Indonesian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=pl" lang="pl">Polski (Polish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=nl" lang="nl">Nederlands (Dutch)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=tr" lang="tr">Türkçe (Turkish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/README.html?lang=ar" lang="ar">العربية (Arabic)</a><br>
</details>
</div>

# NH Reader

**A lightweight, modern, cross-platform client for [nhentai.net](https://nhentai.net).**

NH Reader is not a web wrapper. It is a native desktop and mobile application with its **own custom UI** and a
materially better **search & filter** and **global blacklist** experience than the site provides.
It imports as much data as the site's API makes available — galleries, tags, languages,
categories, artists, characters, parodies — and lets you slice it **locally, instantly**.

> **18+ only.** This application is intended for adults only. By using it you confirm that you
> are of legal age in your jurisdiction to view adult content.

---

## ✨ Highlights

- 🔍 **Search that actually works.** A filter drawer covers text, language, category, per-type tag
  include/exclude (artist, character, parody, group, …), page-count ranges, and six sort modes —
  compiled into native nhentai query syntax (`language:english`, `-tag:...`, `pages:>50`).
- **A blacklist you can trust.** Global, persistent, applied **server-side** (query `-tag:`
  excludes) *and* **client-side** (hide/blur in grids), with a master toggle. It never silently
  breaks the grid or the reader.
- **Native and fast.** Tauri 2 (Rust `reqwest`) backend, native OS window decorations with an in-app top bar, SvelteKit SPA frontend with Svelte 5 runes. Everything runs locally; images load lazily with a Rust image-proxy fallback (backed by a disk cache) when the CDN 404s.
- **Official archive downloads.** Adopts nhentai API v2's dedicated archive endpoint (`POST /api/v2/galleries/{id}/download`) to fetch pre-built zip/cbz archives directly instead of walking CDN page URLs.
- **Background jobs built in.** Gallery downloads, image prefetch, cache/account maintenance, and an optional Popular auto-refresh run in a throttled background service with live progress. Launching the app again on desktop focuses the running window (single instance).
- **Private & versatile account sync.** Favorites, history, blacklist, and settings live locally on your device in SQLite (`database.sqlite`). An optional account sign-in modal supports both official API Keys (bypasses Cloudflare CAPTCHAs) and direct credentials, powering live profile display and synchronized blacklists.
- **Mihon-inspired floating navigation.** Modern thumb-friendly floating navigation bar with a 4px corner radius, backdrop blur elevation, and responsive full-width page-fitting settings layouts.
- **Speaks your language.** Interface defaults to your system locale and can be chosen in Settings. English is shipped out of the box with simple 100% drop-in JSON files for community-contributed translations.
- **Native installers & mobile packaging.** Native NSIS (both per-user and per-machine) and WiX MSI on Windows, DMG on macOS, deb/AppImage on Linux, APK on Android.

## 🖥️ Platforms

| Platform | Support |
| --- | --- |
| Windows 10+ | ✅ Supported (NSIS installer, WiX MSI, portable zip) |
| macOS 10.13+ | ⚠️ Toolchain supported (untested due to lack of macOS hardware) |
| Linux (x86_64) | ✅ Supported (deb, AppImage) |
| Android | ⚠️ Toolchain supported (currently untested due to lack of physical Android device) |
| iOS | ❌ Not supported |

> [!WARNING]
> **Platform Testing Notice (Android & macOS):** The maintainer does not own physical Android or macOS test devices. Android and macOS builds are currently untested. Community verification, test reports, and contributions are welcomed!

## 📦 Installation

Download the latest installer or package from the [Releases](https://github.com/HELIX-Origin/NH-Reader/releases)
page:

- 🪟 **Windows:** `NH Reader_<version>_x64-setup.exe` (NSIS) or `NH Reader_<version>_x64_en-US.msi` (WiX).
- **macOS:** `NH Reader_<version>_x64.dmg` (or `aarch64` for Apple Silicon).
- **Linux:** `nh-reader_<version>_amd64.deb` or `nh-reader_<version>_amd64.AppImage`.
- **Android:** `nh-reader_<version>_universal.apk`.
- **Portable:** Standalone zip package with `.portable` runtime isolation mode.

## 🛠️ Building from source

Requires **Node.js 20+**, **Rust stable**, and the per-platform Tauri prerequisites
([docs](https://v2.tauri.app/start/prerequisites/)).

```bash
npm install
npm run check          # svelte-kit sync + svelte-check (frontend type/lint)
cargo check            # run inside src-tauri/ (backend)
npm run dev:app        # run in dev mode (fixed Vite port 14440)
```

Full release bundle + installer:

```bash
npm run build:app          # runs tauri build (native NSIS/MSI/DMG/deb bundles)
npm run build:app:debug    # debug bundle build
```

## 🏗️ Architecture

Here is the app's high-level architecture: the SvelteKit SPA talks to Tauri commands in Rust,
which wrap the throttled nhentai API client, local SQLite persistence, background worker, and disk image cache.

```mermaid
flowchart TD
    A[SvelteKit SPA] -->|"invoke"| B[commands.rs]
    B --> C[nh_desktop.rs API client]
    B --> D[db.rs SQLite]
    B --> S[service.rs background worker]
    S --> K[image_cache.rs disk cache]
    C -->|"throttled reqwest"| F[nhentai.net API]
    F --> G[nhentai image CDNs]
    A -->|"direct image load"| G
    A -.->|"proxy fallback"| K
```

## 🗂️ Project layout

```
src/                  # SvelteKit SPA frontend (static, adapter-static)
  lib/                # flat modules: api, client, types, query, cache, image, format
  lib/i18n/           # LocaleCatalog class, en.json default, drop-in packs
  lib/stores/         # settings, library, blacklist, account, service, locale (runes + SQLite cache)
  lib/components/     # GalleryCard, GalleryGrid, FilterPanel, BlacklistView, ...
  routes/             # latest, popular, search, favorites, history, blacklist, settings, gallery, reader
src-tauri/            # Rust backend (Tauri 2)
  src/nh_desktop.rs   # nhentai.net API client (reqwest, throttled)
  src/commands.rs     # Tauri commands
  src/db.rs           # local SQLite persistence with poison-recovered locks
  src/service.rs      # background worker queue (downloads, prefetch, maintenance, sync, auto-refresh)
  src/image_cache.rs  # disk image cache (cache-first proxy fallback)
```

## 📚 Documentation

Full documentation lives in the [`docs/`](../README.html) folder:

- [Project page](https://helix-origin.github.io/NH-Reader/) — GitHub Pages site with the landing page, every documentation page, and translatable copies of this README, CONTRIBUTING, SECURITY, PRIVACY and TOS.
- [Documentation Home](../README.html) · [Getting Started](../Getting-Started.html) · [Search & Filters](../Search-and-Filters.html)
- [Blacklist](../Blacklist.html) · [Reader & Galleries](../Reader-and-Galleries.html) · [Settings & API Key](../Settings-and-API-Key.html)
- [Installation & Maintenance](../Installation-and-Maintenance.html) · [Localization](../Localization.html) · [Architecture](../Architecture.html)
- [Security](../Security.html) · [Privacy](../Privacy.html) · [Troubleshooting](../Troubleshooting.html)
- [FAQ](../FAQ.html) · [Development & Contributing](../Development-and-Contributing.html)

Also see [ROADMAP.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/ROADMAP.md), [TODO.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/TODO.md), [BUGS.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/BUGS.md), [CHANGELOG.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/CHANGELOG.md), [PRIVACY.md](PRIVACY.md),
[TOS.md](TOS.md), [SECURITY.md](SECURITY.md), and [CONTRIBUTING.md](CONTRIBUTING.md) in this repository.

The site at `https://helix-origin.github.io/NH-Reader/` is published from the `docs/` folder through repository **Settings → Pages**. The root Markdown files with translation menus are also available on the site as generated copies under `docs/repo/`. When editing one of those root files, regenerate its published copy using `node scripts/build-pages.mjs /tmp/nh-reader-pages` and copy the updated file from `/tmp/nh-reader-pages/repo/` into `docs/repo/`; commit both files together. The old [`.github/workflows/pages.yml`](https://github.com/HELIX-Origin/NH-Reader/blob/main/.github/workflows/pages.yml) builds a staged site for a GitHub Actions Pages source, but it cannot deploy to the currently selected `docs/` source. The Tauri application is never deployed as a website.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Development & Contributing guide](../Development-and-Contributing.html)
for building, testing, and translation instructions. Be respectful, keep changes scoped, and match the existing conventions.

## 📄 License

BSD 3-Clause (see [LICENSE.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/LICENSE.md)). NH Reader is an independent client by HELIX Origin
and is not affiliated with, endorsed by, or sponsored by nhentai.net. Please respect the site's
[terms of service](https://nhentai.net/info/terms/) and rate limits.