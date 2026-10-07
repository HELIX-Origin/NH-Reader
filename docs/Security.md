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
| Zero-cost Windows Code Signing | Local self-signed PFX via the opt-in `npm run sign` command |
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
