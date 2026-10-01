<div align="right">
<details id="translate-menu">
<summary>🌐 Translate this page</summary>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=en" lang="en">English</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=ja" lang="ja">日本語 (Japanese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=zh-CN" lang="zh-CN">简体中文 (Simplified Chinese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=zh-TW" lang="zh-TW">繁體中文 (Traditional Chinese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=ko" lang="ko">한국어 (Korean)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=es" lang="es">Español (Spanish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=fr" lang="fr">Français (French)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=de" lang="de">Deutsch (German)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=ru" lang="ru">Русский (Russian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=pt" lang="pt">Português (Portuguese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=it" lang="it">Italiano (Italian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=th" lang="th">ไทย (Thai)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=vi" lang="vi">Tiếng Việt (Vietnamese)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=id" lang="id">Bahasa Indonesia (Indonesian)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=pl" lang="pl">Polski (Polish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=nl" lang="nl">Nederlands (Dutch)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=tr" lang="tr">Türkçe (Turkish)</a><br>
<a href="https://helix-origin.github.io/NH-Reader/repo/PRIVACY.html?lang=ar" lang="ar">العربية (Arabic)</a><br>
</details>
</div>

# Privacy Policy

**Last updated:** 2026-10-01 · **Version 0.6.1**

The NH Reader client ("the App") is built around one principle: **your data stays on your
machine**. This policy describes what the App collects, stores, and transmits in plain terms.
Short version: **no account, no telemetry, no servers, no third-party trackers.**

---

## 💾 1. What the App stores locally

All persistent data is stored **on your own device**:

| Data | Where | Storage type |
| --- | --- | --- |
| Favorites, reading history, blacklist entries, settings | SQLite `kv` table in `database.sqlite` via `src/lib/cache.ts` | Local only |
| API key (if you add one) | `database.sqlite` via the App's Rust command (`db_set` / `set_api_key`) | Local SQLite |
| Cache (search results, gallery lists, images) | In-memory cache + `database.sqlite` | Local, can be cleared in Settings |

Nothing here is ever sent to us, uploaded, or synced to any server controlled by the publisher.

## 📡 2. What the App transmits

The App talks to exactly one external service: **nhentai.net** (and its image CDNs
`t.nhentai.net` / `i.nhentai.net`), because the App is a client for that site.

- 🔓 **Without an API key:** the App makes the same public API calls any browser would —
  searches, gallery lists, and image requests. No personally identifying information is sent.
- **With an API key:** the key is sent to nhentai.net's API (over HTTPS) to authenticate you
  to *their* service, exactly as logging into their website would. It is not sent anywhere else.

The App also uses your OS to open external links (`@tauri-apps/plugin-opener`) when you click a
"Open on nhentai.net" link — the destination site (nhentai.net) is the only party involved.

## 🚫 3. What the App does NOT do

- ❌ No analytics / telemetry / crash reporting (opt-in or otherwise).
- ❌ No account registration with the publisher.
- ❌ No cloud sync of favorites, history, blacklist, or settings.
- ❌ No cookies or cross-site tracking, no ad SDKs, no fingerprinting.
- ❌ No collection of your name, email, location, or device identifiers.

## 🤝 4. Third-party services

Using nhentai.net through the App means **nhentai.net's own privacy policy also applies** to the
requests you make to them. We are not responsible for their practices. Review their policy at
https://nhentai.net/ if this matters to you.

## 🔄 5. Updates

App updates come from the distribution channel you installed from (e.g., the released installer
on GitHub). The installer itself respects the same local-only principles; uninstalling with the
"Remove user data" option deletes the App's local database and settings.

## 🗑️ 6. Deleting your data

- 🗑️ **All app data** (favorites, history, blacklist, settings): clear it in the App's
   Settings, or delete the App's profile directory on your OS.
- **Your API key:** remove it in Settings → "Clear API key", or delete `database.sqlite`.
- **Everything:** uninstall with **Remove user data** checked, or delete the App data folder
  (`%APPDATA%\net.nh-desktop.client`, `~/Library/Application Support/net.nh-desktop.client`,
  `~/.local/share/net.nh-desktop.client`).

## 📬 7. Contact

Questions? Open an issue or discussion on the
[GitHub repository](https://github.com/HELIX-Origin/NH-Reader). We have no data to hand
over, but we're happy to answer.