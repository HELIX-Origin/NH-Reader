<div align="right">
<details id="translate-menu">
<summary>🌐 Translate this page</summary>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=en" lang="en">English</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=ja" lang="ja">日本語 (Japanese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=zh-CN" lang="zh-CN">简体中文 (Simplified Chinese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=zh-TW" lang="zh-TW">繁體中文 (Traditional Chinese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=ko" lang="ko">한국어 (Korean)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=es" lang="es">Español (Spanish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=fr" lang="fr">Français (French)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=de" lang="de">Deutsch (German)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=ru" lang="ru">Русский (Russian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=pt" lang="pt">Português (Portuguese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=it" lang="it">Italiano (Italian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=th" lang="th">ไทย (Thai)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=vi" lang="vi">Tiếng Việt (Vietnamese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=id" lang="id">Bahasa Indonesia (Indonesian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=pl" lang="pl">Polski (Polish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=nl" lang="nl">Nederlands (Dutch)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=tr" lang="tr">Türkçe (Turkish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/FAQ.html?lang=ar" lang="ar">العربية (Arabic)</a><br>
</details>
</div>

---

> **[Documentation](README.md)** / **FAQ**
>
> 🧭 **Navigation:** [Getting Started](Getting-Started.md) · [Installation](Installation-and-Maintenance.md) · [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Settings](Settings-and-API-Key.md) · [Architecture](Architecture.md) · [All Docs](README.md)

---

# FAQ

Short answers to common questions.

## ❓ Is this an official nhentai.net app?

No. It's an independent client that uses nhentai.net's public API. It is not affiliated with
or endorsed by nhentai.net.

## 🔑 Do I need an API key?

No. Everything works without one. A key adds account features (synced favorites,
authenticated blacklist, downloads) via nhentai.net's API.

## 🕵️ Is my data private?

Yes. See [Privacy](Privacy.md). Everything is stored on-device; the app only talks to
nhentai.net and its CDNs. No telemetry, no app server.

## ⚠️ How is adult content handled?

This is a client for an adult-adjacent site; you must be 18+ to use it. See
[TOS](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md).

## 📦 What installation packages are available?

NH Reader is distributed using Tauri v2's native packaging toolchain:
- **Windows**: Modern NSIS installer (`.exe`) with dual-scope support (per-user or all-users) and enterprise WiX MSI (`.msi`). A portable standalone `.zip` is also provided.
- **macOS**: DMG disk image (`.dmg`) and `.app` bundle.
- **Linux**: Debian package (`.deb`) and self-contained AppImage (`.AppImage`).
- **Android**: Sideloadable APK (`.apk`).
- **iOS**: Not supported.

## 💾 Where is my data stored on disk?

- **Windows**: `%LOCALAPPDATA%\net.nh-reader.client` (or `%APPDATA%\net.nh-reader.client`).
- **macOS**: `~/Library/Application Support/net.nh-reader.client`.
- **Linux**: `~/.local/share/net.nh-reader.client`.
- **Portable Mode**: In the `./data/` folder immediately beside the executable when a `.portable` marker exists.

All persistent data (favorites, history, blacklist, settings, and cache) is stored locally in `database.sqlite`.

## 🚫 Does the blacklist sync with my nhentai.net account?

Yes, if you sign in with your account or API key. Blacklist changes synchronize via `POST /api/v2/blacklist` with resolved numeric tag IDs, completely decoupled from profile attributes. Local-only blacklist without sync is fully supported by default.

## 📥 Can I download galleries for offline reading?

Yes. NH Reader includes a full-featured background download service:
- Dedicated **Download** button on every gallery page (ZIP or CBZ).
- Adopts the official nhentai API v2 dedicated archive endpoint (`POST /api/v2/galleries/{id}/download`) to fetch pre-built archives directly with live byte streaming progress.
- Dedicated **Downloads** management page accessible in the bottom navigation bar.
- Queues persist across app restarts (`database.sqlite`).

## 📱 Is there a mobile version?

Yes. NH Reader supports Android via Tauri 2:
- **Android**: Direct APK distribution and sideloading without third-party store dependencies.
- *Notice*: Because the maintainer does not possess physical Android test hardware, Android builds are currently community-supported and untested.
- **iOS**: Not supported.

## 🤝 I found a bug / want a feature.

Open an issue at [HELIX-Origin/NH-Reader](https://github.com/HELIX-Origin/NH-Reader),
or see [Development & Contributing](Development-and-Contributing.md).

## 🔗 Related

- [Getting Started](Getting-Started.md) · [Troubleshooting](Troubleshooting.md) ·
  [Privacy](Privacy.md) · [ROADMAP.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/ROADMAP.md)

---

### 📚 Documentation Index
- **Core**: [Home](README.md) · [Getting Started](Getting-Started.md) · [Installation & Maintenance](Installation-and-Maintenance.md)
- **App Features**: [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Favorites & History](Favorites-and-History.md) · [Reader & Galleries](Reader-and-Galleries.md) · [Settings & API Key](Settings-and-API-Key.md) · [Localization](Localization.md)
- **Architecture & Development**: [Architecture](Architecture.md) · [Backend (Rust)](Backend-Rust.md) · [Frontend (SvelteKit)](Frontend-SvelteKit.md) · [Packaging & Bundling](Installer-Engine.md) · [Development & Contributing](Development-and-Contributing.md)
- **Reference**: [Security](Security.md) · [Privacy](Privacy.md) · [Troubleshooting](Troubleshooting.md) · [FAQ](FAQ.md)

---

*[NH Reader](https://github.com/HELIX-Origin/NH-Reader) — a lightweight, modern, cross-platform client for nhentai.net.*

*[Documentation Home](README.md) · [Repository](https://github.com/HELIX-Origin/NH-Reader) · [Releases](https://github.com/HELIX-Origin/NH-Reader/releases) · [Security](Security.md) · [Privacy](Privacy.md) · [TOS](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md) · [License](https://github.com/HELIX-Origin/NH-Reader/blob/main/LICENSE.md)*
