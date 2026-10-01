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

- [Security](Security) · [Settings & API Key](Settings-and-API-Key) ·
  [Architecture](Architecture) · [Getting Started](Getting-Started)