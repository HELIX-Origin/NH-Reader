# NH Reader 0.6.0

NH Reader 0.6.0 is a major milestone delivering a completely rebuilt native installer engine, an all-new Library tab with offline archive reading, official API archive downloads, an account authentication modal, Mihon-style floating navigation, squircle design, and seamless process lifecycle handling.

## Highlights

- **Rebuilt Native Installer Engine** — Replaced custom installer routes and bespoke scripts with native Tauri packaging (`tauri build`) using a custom NSIS template (`hooks.nsh`). Delivers a custom NSIS setup with per-user and per-machine installation scopes, enterprise WiX MSI packages, and automatic registration in standard Windows Apps & Features uninstallation.
- **Dedicated Library & Offline Doujin Reading** — Browse and read your downloaded `.zip` and `.cbz` archives directly from the new Library tab, 100% offline without network requests.
- **Official API Archive Downloads** — Downloads now adopt nhentai API v2's dedicated archive endpoint (`POST /api/v2/galleries/{id}/download`), fetching pre-packaged zip/cbz archives directly with real-time streaming progress.
- **Dedicated Account Sign-In Modal** — Log in with official API keys (bypassing Cloudflare CAPTCHAs) or credentials, with live profile/avatar rendering and decoupled tag blacklist synchronization.
- **Mihon-Style Floating Navigation & Squircle Corners** — Modern floating bottom bar with rounded squircle corners (8px - 10px), elevated backdrop blur, and native OS window chrome with an in-app drag header.
- **Decoupled Architecture & Rebrand** — Transitioned identity and storage to NH Reader (`NH Reader.exe`, `net.nh-reader.client`) with decoupled database persistence (`database.sqlite`).

## New

- Rebuilt installer using Tauri's native packaging toolchain with custom NSIS template scripting (`hooks.nsh`) for Windows installation.
- Full uninstaller integration into Windows Settings ("Installed apps" / "Add or remove programs").
- Self-contained portable mode via `.portable` marker or `data/` directory, isolating the database, image cache, and downloads beside the executable.
- Dedicated `/library` tab organizing downloaded doujins, downloaded favorites, and reading history.
- Direct-from-archive page reader streaming pages from `.zip` and `.cbz` archives without network access.
- Account sign-in dialog supporting both API Key and username/password authentication with real-time profile rendering.
- Library favorites filter that strictly isolates downloaded favorites from global favorites.
- Configurable dynamic UI scaling that automatically fills rows to eliminate empty card gaps.
- Standalone Windows code-signing pipeline (`scripts/sign.ps1`, `npm run sign:windows`).

## Improved

- Corner radiuses modernized to small squircle corners (8px - 10px) across cards, navigation pills, and tabs.
- Solid opaque dark backgrounds across account modals and views, removing transparency and clipping.
- Download progress event emissions throttled to prevent UI freezing during high-speed downloads.
- Full-width settings layouts that naturally expand across wide screens.
- Comprehensive platform documentation noting that Android and iOS builds are currently community-supported and untested by the maintainer.

## Fixed

- Resolved WebView2 `Chrome_WidgetWin_0` class unregister error (1411) and process hangs on window exit.
- Fixed avatar image URL resolution for protocol-relative paths (`//static.nhentai.net/...`).
- Fixed file locking collisions when completing downloads on Windows.
- Resolved tag ID formatting issues when synchronizing account blacklists.

## Upgrade

- Download the installer or package for your platform and install it over your existing version. Your SQLite database (`database.sqlite`), favorites, reading history, downloaded archives, and settings carry over automatically.
