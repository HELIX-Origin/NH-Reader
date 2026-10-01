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
<script type="text/javascript" src="./docs/translate.js"></script>

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