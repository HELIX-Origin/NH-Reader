# FAQ

Short answers to common questions.

## ❓ Is this an official nhentai.net app?

No. It's an independent client that uses nhentai.net's public API. It is not affiliated with
or endorsed by nhentai.net.

## 🔑 Do I need an API key?

No. Everything works without one. A key adds account features (synced favorites,
authenticated blacklist, downloads) via nhentai.net's API.

## 🕵️ Is my data private?

Yes. See [Privacy](Privacy). Everything is stored on-device; the app only talks to
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
or see [Development & Contributing](Development-and-Contributing).

## 🔗 Related

- [Getting Started](Getting-Started) · [Troubleshooting](Troubleshooting) ·
  [Privacy](Privacy) · [ROADMAP.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/ROADMAP.md)