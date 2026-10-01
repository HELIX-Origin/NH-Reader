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

- [Privacy](Privacy) · [Installer Engine](Installer-Engine) ·
  [Architecture](Architecture) · [Settings & API Key](Settings-and-API-Key)