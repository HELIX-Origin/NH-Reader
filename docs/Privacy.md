<div align="right">
<details id="translate-menu">
<summary>🌐 Translate this page</summary>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=en" lang="en">English</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=ja" lang="ja">日本語 (Japanese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=zh-CN" lang="zh-CN">简体中文 (Simplified Chinese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=zh-TW" lang="zh-TW">繁體中文 (Traditional Chinese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=ko" lang="ko">한국어 (Korean)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=es" lang="es">Español (Spanish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=fr" lang="fr">Français (French)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=de" lang="de">Deutsch (German)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=ru" lang="ru">Русский (Russian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=pt" lang="pt">Português (Portuguese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=it" lang="it">Italiano (Italian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=th" lang="th">ไทย (Thai)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=vi" lang="vi">Tiếng Việt (Vietnamese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=id" lang="id">Bahasa Indonesia (Indonesian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=pl" lang="pl">Polski (Polish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=nl" lang="nl">Nederlands (Dutch)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=tr" lang="tr">Türkçe (Turkish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Privacy.html?lang=ar" lang="ar">العربية (Arabic)</a><br>
</details>
</div>

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

*[Documentation Home](README.md) · [Repository](https://github.com/HELIX-Origin/NH-Reader) · [Releases](https://github.com/HELIX-Origin/NH-Reader/releases) · [Security](Security.md) · [Privacy](Privacy.md) · [TOS](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md) · [License](https://github.com/HELIX-Origin/NH-Reader/blob/main/LICENSE.md)*
