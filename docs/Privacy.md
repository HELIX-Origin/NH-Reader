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

> **[Documentation](README.md)** / **Privacy**
>
> 🧭 **Navigation:** [Getting Started](Getting-Started.md) · [Installation](Installation-and-Maintenance.md) · [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Settings](Settings-and-API-Key.md) · [Architecture](Architecture.md) · [All Docs](README.md)

---

# Privacy

What NH Reader stores, what it sends, and what it never does.

> Full policy: [PRIVACY.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/PRIVACY.md)
> (repo root). This wiki page is the short version.

## 💾 What stays on your device

| Data | Storage |
| --- | --- |
| Favorites, history, blacklist, settings | SQLite `kv` table in `database.sqlite` |
| API key / Token + cache mirror (`nh-reader:…` entries) | `database.sqlite` (SQLite in app data dir) |
| Downloaded archives & image cache | `downloads/` and `cache/images/` |

All of it is local. There is no app server; you are never "logged in" to anything except
nhentai.net itself (optional, via API key or direct credentials).

## 🌐 What goes over the network

- Requests to **nhentai.net** (API) and its image **CDNs** (`t.nhentai.net`,
  `i.nhentai.net`, `static.nhentai.net`) — only what you trigger by browsing, searching, or loading an image.
- If you supply an API key or log in with credentials, authenticated requests go directly to nhentai.net over HTTPS to synchronize favorites/blacklist or fetch official archives. Your credentials/keys are never sent to any third party.

## 🚫 What it does **not** do

- No analytics, no tracking, no crash reporters, no third-party SDKs.
- No data collection or phone-home endpoints.
- Does not read your files, scan your drives, or upload gallery content.
- Does not store your data on any server we run.

## 🗑️ Deleting your data

- Clear the image cache or query cache from **Settings → Storage & Cache**.
- Clear favorites/history/blacklist from the corresponding views or export them to JSON for backups.
- Full removal: delete the `%LOCALAPPDATA%\net.nh-reader.client` folder (or local `data/` folder in portable mode) to wipe `database.sqlite` and all cached files.

## 🧩 Third-party

The app is built on Tauri (Rust), SvelteKit, and reuses only standard dependencies. See
`package.json` / `src-tauri/Cargo.toml` for the exact list.

## 📮 Contact

Questions/requests → GitHub issues on
[HELIX-Origin/NH-Reader](https://github.com/HELIX-Origin/NH-Reader) or the
maintainer contact in PRIVACY.md.

## 🔗 Related

- [Security](Security.md) · [Settings & API Key](Settings-and-API-Key.md) ·
  [Architecture](Architecture.md) · [Getting Started](Getting-Started.md)

---

### 📚 Documentation Index
- **Core**: [Home](README.md) · [Getting Started](Getting-Started.md) · [Installation & Maintenance](Installation-and-Maintenance.md)
- **App Features**: [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Favorites & History](Favorites-and-History.md) · [Reader & Galleries](Reader-and-Galleries.md) · [Settings & API Key](Settings-and-API-Key.md) · [Localization](Localization.md)
- **Architecture & Development**: [Architecture](Architecture.md) · [Backend (Rust)](Backend-Rust.md) · [Frontend (SvelteKit)](Frontend-SvelteKit.md) · [Packaging & Bundling](Installer-Engine.md) · [Development & Contributing](Development-and-Contributing.md)
- **Reference**: [Security](Security.md) · [Privacy](Privacy.md) · [Troubleshooting](Troubleshooting.md) · [FAQ](FAQ.md)

---

*[NH Reader](https://github.com/HELIX-Origin/NH-Reader) — a lightweight, modern, cross-platform client for nhentai.net.*

*[Documentation Home](README.md) · [Repository](https://github.com/HELIX-Origin/NH-Reader) · [Releases](https://github.com/HELIX-Origin/NH-Reader/releases) · [Security](Security.md) · [Privacy](Privacy.md) · [TOS](../TOS.md) · [License](../LICENSE.md)*
