# Backend (Rust)

The Tauri 2 Rust backend lives in `src-tauri/`. It owns **all networking**, **local
persistence**, **background tasks**, and keeps the WebView sandboxed. No panic crosses
the command boundary: every command returns `Result<_, String>`.

Here's the lifecycle of a request, from UI to nhentai.net and back:

```mermaid
flowchart TD
    A[Frontend invoke] -->|"invoke()"| B[Command handler]
    B -->|"calls client"| C[NhDesktopClient]
    C -->|"HTTPS throttled"| D[nhentai.net API]
    D -->|"typed JSON"| C
    C -->|"typed model"| B
    B -->|"Result Ok or Err"| A
```

## 🧩 Modules

| File | Responsibility |
| --- | --- |
| `src-tauri/src/nh_desktop.rs` | `NhDesktopClient` — typed nhentai.net API client (reqwest) + `THROTTLE` |
| `src-tauri/src/commands.rs` | All `#[tauri::command]` handlers |
| `src-tauri/src/db.rs` | SQLite persistence (`Db`, `database.sqlite`), compaction, and cache pruning |
| `src-tauri/src/service.rs` | `BackgroundService` — throttled worker queue (downloads, prefetch, maintenance, sync, auto-refresh) |
| `src-tauri/src/image_cache.rs` | `ImageCache` — disk image cache at `cache/images`, LRU budget pruning, backing `proxy_image` |
| `src-tauri/src/error.rs` | Friendly error type |
| `src-tauri/src/main.rs` | Application entry point |

## ⚡ Commands (the full surface)

All commands are snake_case, registered on the Tauri invoke handler.

### 🔍 Display & discovery

| Command | What it does |
| --- | --- |
| `fetch_new` | New/recent galleries (paginated) |
| `fetch_popular` | Popular galleries (site's list) |
| `fetch_tagged` | Galleries for a tag (type, sort, page) |
| `search_galleries` | Search with query text + sort + page |
| `fetch_gallery` | Single gallery detail (with favorite state) |
| `related_galleries` | Related galleries for a gallery id |
| `fetch_tag_info` | Tag metadata by `type`/`slug` |
| `fetch_tags_by_type` | Tag listing for a given tag type |
| `proxy_image` | Fetch image bytes (CDN fallback) → `Vec<u8>` (served from the disk image cache first) |

### 💾 Local DB (key/value)

| Command | What it does |
| --- | --- |
| `db_get` / `db_set` / `db_del` | Single key operations in `database.sqlite` |
| `db_dump` / `db_clear` | Full-table dump / clear |

### 🗄️ Storage & Cache Management

| Command | What it does |
| --- | --- |
| `get_storage_stats` | Return disk usage telemetry (image cache bytes + count, query cache rows, database file size) |
| `set_cache_budget` | Configure maximum storage budget (bytes) for background LRU pruning |
| `clear_image_cache` | Wipe cached disk images |
| `clear_query_cache` | Clear cached API response rows in `database.sqlite` without touching user favorites/blacklist/settings |
| `optimize_storage` | Reclaim physical disk space via SQLite `VACUUM` |

### 🔑 Account & Authentication

| Command | What it does |
| --- | --- |
| `set_api_key` / `get_api_key_status` / `clear_api_key` | Store/query/clear the local API key |
| `login_account` | Authenticate with username and password (`POST /api/v2/auth/login`) and store token |
| `verify_api_key` / `get_current_user` | Validate key or token; fetch `/api/v2/user` (`UserMeResponse`) |
| `check_favorite` / `add_favorite` / `remove_favorite` | Account favorite state |
| `fetch_favorites` | Remote favorites list |
| `fetch_account_blacklist` / `update_account_blacklist` | Account blacklist sync via `POST /api/v2/blacklist` |
| `download_gallery` | Fetch official archive URL via `POST /api/v2/galleries/{id}/download` or direct URL |

### 🛰️ Background service & System

`BackgroundService` (`service.rs`) runs a single throttled worker; jobs are enqueued as
`service://job` events stream progress to the UI.

| Command | What it does |
| --- | --- |
| `service_enqueue_download` | Download gallery ZIP/CBZ → disk (progress events); returns job id |
| `service_enqueue_prefetch` | Prefetch a list of image URLs into the image cache |
| `service_enqueue_maintenance` | Prune image cache (LRU budget) + cached lists (7d) |
| `service_enqueue_sync` | Account favorites + blacklist sync into cached mirrors |
| `service_status` | Pending job count |
| `service_set_auto_refresh` | Enable/disable Popular auto-refresh (interval `≥15` min) |
| `service_get_auto_refresh` | Current auto-refresh config |
| `service_get_downloads_dir` / `service_set_downloads_dir` / `service_reset_downloads_dir` | Downloads folder config |
| `open_downloads_folder` | Reveal downloaded files in OS file manager |
| `get_system_locale` | Detect OS locale tag (`sys-locale`) |
| `app_quit` | Gracefully quit application |

## 🦀 Networking rules

- 🦀 **One client, one place:** `NhDesktopClient` is the only thing touching nhentai.net.
- **Respect the site:** a `THROTTLE` sleep keeps requests human-paced; single-flight/reuse
  patterns avoid fan-out. The background service runs one job at a time.
- **Image hosts:** any `*.nhentai.net` subdomain is accepted (`is_allowlisted_image_host`),
  so `t.`/`i.`/`static.` all work; matching CSP `img-src` in `tauri.conf.json`.
- **Typed serde models** mirror the API JSON 1:1; deserialization tests cover the shapes.
- **TLS:** `reqwest` with `rustls` (no OpenSSL dependency), gzip enabled.

## 🚨 Error handling

- 🚨 `error.rs` provides friendly error types; commands never return `panic!`.
- Failure to load a resource (image/CDN) is signaled with a clean `Err(String)` the UI renders
  as a retryable notice (see [Reader & Galleries](Reader-and-Galleries)).
- The DB is behind a `Mutex<Connection>`; all access is short-lived and unlock-and-drop.

## 🤝 Related

- [Architecture](Architecture) · [Frontend (SvelteKit)](Frontend-SvelteKit) ·
  [Security](Security)