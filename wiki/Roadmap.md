# Roadmap

Where the project is headed. Source of truth: the repo-root
[ROADMAP.md](https://github.com/HELIX-Origin/nhentai-desktop/blob/main/ROADMAP.md) and
`TODO.md`.

## 🏗️ Guiding principles

1. **Filtering first.** Every view shares the same filter engine.
2. **Blacklist without compromise.** Global, persistent, instant, toggle-able — never breaks
   the grid or reader.
3. **Fast and light.** SPA on Tauri; images lazy; requests throttled.
4. **Local & private.** Favorites, history, blacklist, settings stay on-device.

## 🚫 Non-goals

- **Mobile support (Android/iOS).** Desktop-only, deliberately. Android already has a good
  third-party client ([NClientV3](https://github.com/maxwai/NClientV3)); iOS rejects NSFW apps
  and its developer license is prohibitively expensive. Use NClientV3 on Android or the site in
  a browser.

## 🗺️ Milestones

| # | Milestone | Status | Scope |
| --- | --- | --- | --- |
| M1 | Foundation | ✅ Shipped (core); closeout pending | Scaffold, Rust client + 43 commands, CSP, shell/tokens/stores/views, unified installer; remaining: clean-clone baseline verification |
| M2 | Browse & discover | ✅ Shipped (core) | Home (new), popular, grid/cards, pagination, lazy images with proxy fallback |
| M3 | Search & filters | ✅ Shipped (core) | Query builder, filter drawer (text/language/category/tags/pages/sort) |
| M4 | Global blacklist | ✅ Shipped (core) | Manage panel, server-side `-tag:` excludes, client-side hide/blur, master toggle |
| M5 | Library | ✅ Shipped (core) | Favorites, history, local persistence; export/import still backlog |
| M6 | Reader | ✅ Shipped (core) | Detail, paged thumbnails, strip mode, preload, fullscreen |
| M7 | Downloads & background services | 🚧 In progress (core + UI shipped) | Background-service core shipped: zip/cbz/torrent downloads to disk with progress, image prefetch, cache/image maintenance, account sync, Popular auto-refresh, job events; per-gallery Download button + Downloads page shipped. Backlog: queue resume/persist, cache consumers, storage-management polish |
| M8 | Polish / release | 🚧 In progress (0.4.0 shipped) | Release 0.4.0 shipped 2026-09-30 (100% drop-in hand-rolled localization, poison-recovered DB locks, translation contribution guide). Backlog: accent picker, image quality, reader preload distance |
| M9 | Localization & language packs | ✅ Core shipped (M9.1) | 100% drop-in hand-rolled architecture with LocaleCatalog, English default, OS fallback, installer and settings language pickers. Remaining language packs open to community contributions |

## 🚧 Current focus

M7's background-service core and downloads UI shipped (per-gallery Download button, ZIP/CBZ/
torrent formats, Downloads page, configurable downloads folder). M9's drop-in localization architecture
shipped with English default and system locale fallback. Current focus: M1 closeout
(clean-clone baseline verification) and remaining M8 hardening (accent picker, image quality,
reader preload distance).

See [Backend (Rust)](Backend-Rust), [Frontend (SvelteKit)](Frontend-SvelteKit),
[Installer Engine](Installer-Engine), and [Localization](Localization) for implementation details.

## 🔗 Related

- [Home](Home) · [FAQ](FAQ) · [Development & Contributing](Development-and-Contributing)