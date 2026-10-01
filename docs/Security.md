<div align="right">
<details id="translate-menu">
<summary>🌐 Translate this page</summary>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=en" lang="en">English</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=ja" lang="ja">日本語 (Japanese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=zh-CN" lang="zh-CN">简体中文 (Simplified Chinese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=zh-TW" lang="zh-TW">繁體中文 (Traditional Chinese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=ko" lang="ko">한국어 (Korean)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=es" lang="es">Español (Spanish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=fr" lang="fr">Français (French)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=de" lang="de">Deutsch (German)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=ru" lang="ru">Русский (Russian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=pt" lang="pt">Português (Portuguese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=it" lang="it">Italiano (Italian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=th" lang="th">ไทย (Thai)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=vi" lang="vi">Tiếng Việt (Vietnamese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=id" lang="id">Bahasa Indonesia (Indonesian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=pl" lang="pl">Polski (Polish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=nl" lang="nl">Nederlands (Dutch)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=tr" lang="tr">Türkçe (Turkish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/Security.html?lang=ar" lang="ar">العربية (Arabic)</a><br>
</details>
</div>

---

> **[Documentation](README.md)** / **Security**
>
> 🧭 **Navigation:** [Getting Started](Getting-Started.md) · [Installation](Installation-and-Maintenance.md) · [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Settings](Settings-and-API-Key.md) · [Architecture](Architecture.md) · [All Docs](README.md)

---

# Security

Security posture, reporting, and hardening notes for NH Reader.

> The full project policy lives at
> [SECURITY.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/SECURITY.md) in the
> repo root — this page is the wiki summary.

## 🏗️ Design principles

- **Local-first.** Favorites, history, blacklist, settings and the cache live on-device in
  SQLite (`database.sqlite`). No app server, no telemetry.
- **No remote code paths.** The WebView never executes remote scripts; CSP restricts
  connections to nhentai.net + its CDNs.
- **One network path.** All API traffic goes through `NhDesktopClient` (reqwest), throttled
  (`THROTTLE`) to respect nhentai.net and avoid hammering the service.
- **Credentials & API keys stay local.** The nhentai.net API key or bearer token is stored in `database.sqlite` only and is used
  solely to authenticate requests you trigger; it is never uploaded anywhere else. The UI shows
  only masked prefixes.

## 🛡️ Hardenings in place

| Area | Where |
| --- | --- |
| CSP (`default-src 'self'` + image hosts + IPC only) | `src-tauri/tauri.conf.json` |
| Dev CSP (Vite HMR) isolated from production | `security.devCsp` in the same config |
| Result-based errors (no panics across the bridge) | `src-tauri/src/error.rs` |
| Request throttle | `nh_desktop.rs` |
| Zero-cost Windows Code Signing | Local self-signed PFX script (`npm run sign:windows`) |
| Native sandboxed installers | NSIS & WiX MSI with verified cleanup |

## 🚨 Supported versions / reporting

- Supported: latest release (0.5.x+).
- Report vulnerabilities via **GitHub private vulnerability reporting** on the repository, or
  to the maintainer directly (contacts in SECURITY.md).
- Scope: the app code, installer, and build scripts. Out of scope: nhentai.net itself and
  its CDNs.

## 🔗 Related

- [Privacy](Privacy.md) · [Installer Engine](Installer-Engine.md) ·
  [Architecture](Architecture.md) · [Settings & API Key](Settings-and-API-Key.md)

---

### 📚 Documentation Index
- **Core**: [Home](README.md) · [Getting Started](Getting-Started.md) · [Installation & Maintenance](Installation-and-Maintenance.md)
- **App Features**: [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Favorites & History](Favorites-and-History.md) · [Reader & Galleries](Reader-and-Galleries.md) · [Settings & API Key](Settings-and-API-Key.md) · [Localization](Localization.md)
- **Architecture & Development**: [Architecture](Architecture.md) · [Backend (Rust)](Backend-Rust.md) · [Frontend (SvelteKit)](Frontend-SvelteKit.md) · [Packaging & Bundling](Installer-Engine.md) · [Development & Contributing](Development-and-Contributing.md)
- **Reference**: [Security](Security.md) · [Privacy](Privacy.md) · [Troubleshooting](Troubleshooting.md) · [FAQ](FAQ.md)

---

*[NH Reader](https://github.com/HELIX-Origin/NH-Reader) — a lightweight, modern, cross-platform client for nhentai.net.*

*[Documentation Home](README.md) · [Repository](https://github.com/HELIX-Origin/NH-Reader) · [Releases](https://github.com/HELIX-Origin/NH-Reader/releases) · [Security](Security.md) · [Privacy](Privacy.md) · [TOS](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md) · [License](https://github.com/HELIX-Origin/NH-Reader/blob/main/LICENSE.md)*
