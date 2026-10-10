---
layout: docs
title: Favorites & History
summary: Managing favorites and viewing history in NH Reader
parent: Documentation Home
---

# Favorites & History

The client keeps two personal libraries locally: **Favorites** and **History**. Both persist
via the SQLite-backed KV cache (`src/lib/cache.ts` → `database.sqlite`), so they survive restarts
and live only on your machine — see [Privacy](Privacy.md).

## ⭐ Favorites

### 🛠️ Adding / removing

- From a gallery **detail page**: the **Favorite** toggle (heart) adds or removes the gallery.
  It works **with or without** an nhentai.net API key:
  - **No API key:** the favorite is stored **locally only** in `database.sqlite`.
  - **API key configured:** the toggle also calls `check_favorite` / `add_favorite` /
    `remove_favorite` against your nhentai.net account (streaming sync).
- From any grid card: the card's favorite badge/button.

### 🖼️ Viewing & Export/Import

The **Favorites** page lists your favorited galleries with Dynamic UI Scaling. With an API key it can also fetch your
remote nhentai.net favorites (`fetch_favorites`) and merge/sync them into the local view.
You can export and import your favorites as a standalone `.json` file anytime directly from the Favorites view or Settings Data management.

### 💡 What counts as a favorite?

A gallery is considered a favorite if either:

- it exists in your local favorites list, **or**
- (with API key) your nhentai.net account marks it favorite.

The detail page's favorite state reflects both sources. A favorite removed remote-side is
reflected next time the local list syncs.

## 🕑 History

### 📝 Recording

Every gallery you **open** (reader or detail) is recorded with a timestamp. History tracks
**which gallery, when**, nothing more.

### 🖼️ In the app

- **History** page lists recently-viewed galleries (most recent first), letting you jump back
  to anything you've read without re-searching.
- History persists locally and is **not** synced anywhere (no account-history feature).

### 🗑️ Clearing

History can be cleared as a batch from the History page. (Individual-entry removal is on the
roadmap.)

## 💾 Storage & privacy

- `src/lib/stores/library.svelte.ts` — favorites + history (SQLite-backed cache, runes-based
  store).
- The store writes through `src/lib/cache.ts` to `database.sqlite` — still local.
- No favorites/history telemetry. Ever.

## 🔗 Related

- [Reader & Galleries](Reader-and-Galleries.md) — opening galleries (which populates history)
- [Settings & API Key](Settings-and-API-Key.md) — account-sync enablement
- [Privacy](Privacy.md)

---

### 📚 Documentation Index
- **Core**: [Home](README.md) · [Getting Started](Getting-Started.md) · [Installation & Maintenance](Installation-and-Maintenance.md)
- **App Features**: [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Favorites & History](Favorites-and-History.md) · [Reader & Galleries](Reader-and-Galleries.md) · [Settings & API Key](Settings-and-API-Key.md) · [Localization](Localization.md)
- **Architecture & Development**: [Architecture](Architecture.md) · [Backend (Rust)](Backend-Rust.md) · [Frontend (SvelteKit)](Frontend-SvelteKit.md) · [Packaging & Bundling](Installer-Engine.md) · [Development & Contributing](Development-and-Contributing.md)
- **Reference**: [Security](Security.md) · [Privacy](Privacy.md) · [Troubleshooting](Troubleshooting.md) · [FAQ](FAQ.md)

---

*[NH Reader](https://github.com/HELIX-Origin/NH-Reader) — a lightweight, modern, cross-platform client for nhentai.net.*

*[Documentation Home](README.md) · [Repository](https://github.com/HELIX-Origin/NH-Reader) · [Releases](https://github.com/HELIX-Origin/NH-Reader/releases) · [Security](Security.md) · [Privacy](Privacy.md) · [TOS](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md) · [License](https://github.com/HELIX-Origin/NH-Reader/blob/main/LICENSE.md)*
