<div align="right">
  <label for="translate-select" style="font-size:12px; color:#a1a1aa; margin-right:6px;">🌐 Language:</label>
  <select id="translate-select" style="background:#18181b; color:#f4f4f5; border:1px solid #3f3f46; border-radius:6px; padding:4px 8px; font-size:12px; cursor:pointer;" onchange="translatePage(this.value)">
    <option value="en">English</option>
    <option value="ja">日本語 (Japanese)</option>
    <option value="zh-CN">简体中文 (Simplified Chinese)</option>
    <option value="zh-TW">繁體中文 (Traditional Chinese)</option>
    <option value="ko">한국어 (Korean)</option>
    <option value="es">Español (Spanish)</option>
    <option value="fr">Français (French)</option>
    <option value="de">Deutsch (German)</option>
    <option value="ru">Русский (Russian)</option>
    <option value="pt">Português (Portuguese)</option>
    <option value="it">Italiano (Italian)</option>
    <option value="th">ไทย (Thai)</option>
    <option value="vi">Tiếng Việt (Vietnamese)</option>
    <option value="id">Bahasa Indonesia (Indonesian)</option>
    <option value="pl">Polski (Polish)</option>
    <option value="nl">Nederlands (Dutch)</option>
    <option value="tr">Türkçe (Turkish)</option>
    <option value="ar">العربية (Arabic)</option>
  </select>
  <div id="google_translate_element" style="display:none;"></div>
</div>
<script type="text/javascript" src="./translate.js"></script>

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
