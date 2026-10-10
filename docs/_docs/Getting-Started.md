---
layout: docs
title: Getting Started
summary: Your first minutes with NH Reader
parent: Documentation Home
---

# Getting Started

This page walks you through your first minutes with **NH Reader**. Everything is local-first:
no account required, nothing to sign up for.

## 📦 1. Install

Download the installer or package for your OS/device from
[Releases](https://github.com/HELIX-Origin/NH-Reader/releases) and run the installer. See
[Installation & Maintenance](Installation-and-Maintenance.md) for the full walkthrough across
Windows, macOS, Linux, and Android.

## 🏁 2. First launch

The app opens on the **New** (home) feed — recently published galleries, paginated and dynamically scaled. The
floating Mihon-inspired bottom navigation bar navigates everywhere:

- **New** — latest galleries
- **Popular** — the site's popular list
- **Favorites** / **History** — your local library
- **Downloads** — background download manager
- **Blacklist** — global [blacklist](Blacklist.md) management
- **Settings** — appearance, Dynamic UI Scaling, optional [API key / Login](Settings-and-API-Key.md), storage management, and background services

## 🔑 3. Do you need an account or API key?

**No.** Browsing, searching, the reader, favorites, history, downloads, and blacklist all work without
one. Connecting an nhentai.net account is **optional** and unlocks account-backed features:

- **Account sync:** view and manage your nhentai.net account *favorites* and *blacklist* from
  within the app (see [Favorites & History](Favorites-and-History.md)).
- **Account status:** display your connected username and avatar in the top bar.
- **Dedicated Login Modal:** Sign in via the account button in the top bar or via **Settings → nhentai account**. You can authenticate using either:
  1. **Official API Key** *(Recommended)*: Generated from nhentai.net → *Settings → API Key*. Bypasses Cloudflare CAPTCHAs completely.
  2. **Account Credentials**: Direct username and password authentication (`POST /api/v2/auth/login`).

Credentials and tokens are stored locally in `database.sqlite` and sent only to nhentai.net over HTTPS — see
[Privacy](Privacy.md).

## 🔍 4. Search something real

Try the **Search** page. Enter raw nhentai syntax (`english`, `-lolicon`, `artist:hana`), or
open the **Filters** drawer for structured controls. Example that mixes both:

```
blue archive language:english -tag:lolicon pages:>100
```

See [Search & Filters](Search-and-Filters.md) for the full language reference.

## 🚫 5. Set up your blacklist

Go to **Blacklist** and add tags or text patterns you never want to see. The blacklist is:

- applied **server-side** (tag excludes are baked into every search's query — the site itself
  filters),
- applied **client-side** too (hide/blur in grids),
- toggleable globally (master switch) — flip it off if a search is "too empty".

Details: [Blacklist](Blacklist.md).

## 🖼️ 6. Reading

Open any gallery to see its detail page, then hit the reader. Paged thumbnails, strip mode,
preload, and fullscreen are all supported — see [Reader & Galleries](Reader-and-Galleries.md).

## ❓ 7. Unsure about something?

Check [Troubleshooting](Troubleshooting.md) and the [FAQ](FAQ.md). For behavior/errors you
still can't resolve, open an issue at the [repository](https://github.com/HELIX-Origin/NH-Reader).

---

- Next: [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md)

---

### 📚 Documentation Index
- **Core**: [Home](README.md) · [Getting Started](Getting-Started.md) · [Installation & Maintenance](Installation-and-Maintenance.md)
- **App Features**: [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Favorites & History](Favorites-and-History.md) · [Reader & Galleries](Reader-and-Galleries.md) · [Settings & API Key](Settings-and-API-Key.md) · [Localization](Localization.md)
- **Architecture & Development**: [Architecture](Architecture.md) · [Backend (Rust)](Backend-Rust.md) · [Frontend (SvelteKit)](Frontend-SvelteKit.md) · [Packaging & Bundling](Installer-Engine.md) · [Development & Contributing](Development-and-Contributing.md)
- **Reference**: [Security](Security.md) · [Privacy](Privacy.md) · [Troubleshooting](Troubleshooting.md) · [FAQ](FAQ.md)

---

*[NH Reader](https://github.com/HELIX-Origin/NH-Reader) — a lightweight, modern, cross-platform client for nhentai.net.*

*[Documentation Home](README.md) · [Repository](https://github.com/HELIX-Origin/NH-Reader) · [Releases](https://github.com/HELIX-Origin/NH-Reader/releases) · [Security](Security.md) · [Privacy](Privacy.md) · [TOS](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md) · [License](https://github.com/HELIX-Origin/NH-Reader/blob/main/LICENSE.md)*
