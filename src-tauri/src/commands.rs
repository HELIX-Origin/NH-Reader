use crate::db::Db;
use crate::image_cache::ImageCache;
use crate::nh_desktop::{
    FavoriteResponse, GalleryDetail, GalleryList, NhDesktopClient, Paginated, RelatedGalleries,
    TagResponse, UserMeResponse, GalleryListItem,
};
use crate::service::{get_auto_refresh, set_auto_refresh, AutoRefreshConfig, BackgroundService, ServiceStatus};
use serde::Serialize;
use std::sync::Arc;
use tauri::State;

#[derive(Serialize)]
pub struct ApiKeyStatus {
    pub configured: bool,
    pub prefix: Option<String>,
}

fn optional_key(db: &Db) -> Option<String> {
    db.api_key().ok().flatten()
}

fn require_key(db: &Db) -> Result<String, String> {
    db.api_key()
        .map_err(|e| format!("Failed to read stored api key: {e}"))?
        .ok_or_else(|| "No nhentai API key configured. Add one in Settings.".to_string())
}

#[tauri::command]
pub fn app_quit(app: tauri::AppHandle) {
    app.exit(0);
}

#[tauri::command]
pub fn get_system_locale() -> String {
    sys_locale::get_locale().unwrap_or_else(|| "en".to_string())
}


#[tauri::command]
pub async fn fetch_new(client: State<'_, NhDesktopClient>, db: State<'_, Db>, page: Option<u32>, per_page: Option<u32>) -> Result<GalleryList, String> {
    client
        .list_galleries(optional_key(&db).as_deref(), page.unwrap_or(1), per_page.unwrap_or(28))
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_popular(client: State<'_, NhDesktopClient>, db: State<'_, Db>) -> Result<Vec<GalleryListItem>, String> {
    client.popular(optional_key(&db).as_deref()).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_tagged(client: State<'_, NhDesktopClient>, db: State<'_, Db>, tag_id: u64, sort: Option<String>, page: Option<u32>, per_page: Option<u32>) -> Result<GalleryList, String> {
    client
        .tagged(optional_key(&db).as_deref(), tag_id, sort.as_deref().unwrap_or("date"), page.unwrap_or(1), per_page.unwrap_or(28))
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn search_galleries(client: State<'_, NhDesktopClient>, db: State<'_, Db>, query: String, sort: Option<String>, page: Option<u32>) -> Result<GalleryList, String> {
    client
        .search(optional_key(&db).as_deref(), &query, sort.as_deref().unwrap_or("date"), page.unwrap_or(1))
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_gallery(client: State<'_, NhDesktopClient>, db: State<'_, Db>, id: u64, include: Option<String>) -> Result<GalleryDetail, String> {
    client
        .gallery(optional_key(&db).as_deref(), id, include.as_deref().unwrap_or("favorite"))
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn related_galleries(client: State<'_, NhDesktopClient>, db: State<'_, Db>, id: u64) -> Result<RelatedGalleries, String> {
    client.related(optional_key(&db).as_deref(), id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_tag_info(client: State<'_, NhDesktopClient>, tag_type: String, slug: String) -> Result<TagResponse, String> {
    client
        .request::<TagResponse>(None, reqwest::Method::GET, &format!("/tags/{tag_type}/{slug}"), &[], None)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_tags_by_type(
    client: State<'_, NhDesktopClient>,
    db: State<'_, Db>,
    tag_type: String,
    sort: Option<String>,
    page: Option<u32>,
    per_page: Option<u32>,
) -> Result<Paginated<TagResponse>, String> {
    client
        .tags_by_type(
            optional_key(&db).as_deref(),
            &tag_type,
            sort.as_deref().unwrap_or("popular"),
            page.unwrap_or(1),
            per_page.unwrap_or(24),
        )
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn proxy_image(client: State<'_, NhDesktopClient>, cache: State<'_, Arc<ImageCache>>, url: String) -> Result<Vec<u8>, String> {
    if let Some(bytes) = cache.get(&url) {
        return Ok(bytes);
    }
    let bytes = client.image_bytes(&url).await.map_err(|e| e.to_string())?;
    let _ = cache.put(&url, &bytes);
    Ok(bytes)
}

#[tauri::command]
pub fn db_get(db: State<'_, Db>, key: String) -> Result<Option<String>, String> {
    db.get(&key).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_set(db: State<'_, Db>, key: String, value: String) -> Result<(), String> {
    db.set(&key, &value).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_del(db: State<'_, Db>, key: String) -> Result<(), String> {
    db.del(&key).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_dump(db: State<'_, Db>) -> Result<Vec<(String, String)>, String> {
    db.dump().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn db_clear(db: State<'_, Db>) -> Result<(), String> {
    db.clear().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_api_key(db: State<'_, Db>, key: String) -> Result<(), String> {
    let trimmed = key.trim();
    if trimmed.is_empty() {
        return Err("API key must not be empty.".to_string());
    }
    db.set_api_key(trimmed).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_api_key_status(db: State<'_, Db>) -> Result<ApiKeyStatus, String> {
    Ok(match db.api_key().map_err(|e| e.to_string())? {
        Some(key) => ApiKeyStatus {
            configured: true,
            prefix: Some(key.chars().take(4).collect()),
        },
        None => ApiKeyStatus { configured: false, prefix: None },
    })
}

#[tauri::command]
pub fn clear_api_key(db: State<'_, Db>) -> Result<(), String> {
    db.clear_api_key().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn verify_api_key(client: State<'_, NhDesktopClient>, db: State<'_, Db>) -> Result<UserMeResponse, String> {
    let key = require_key(&db)?;
    client.current_user(&key).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_current_user(client: State<'_, NhDesktopClient>, db: State<'_, Db>) -> Result<UserMeResponse, String> {
    let key = require_key(&db)?;
    client.current_user(&key).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn login_account(
    client: State<'_, NhDesktopClient>,
    db: State<'_, Db>,
    req: crate::nh_desktop::LoginRequest,
) -> Result<crate::nh_desktop::UserMeResponse, String> {
    let resp = client.login(&req).await.map_err(|e| e.to_string())?;
    db.set_api_key(&resp.access_token).map_err(|e| e.to_string())?;
    Ok(resp.user)
}

#[tauri::command]
pub async fn check_favorite(client: State<'_, NhDesktopClient>, db: State<'_, Db>, id: u64) -> Result<FavoriteResponse, String> {
    let key = require_key(&db)?;
    client.check_favorite(&key, id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn add_favorite(client: State<'_, NhDesktopClient>, db: State<'_, Db>, id: u64) -> Result<FavoriteResponse, String> {
    let key = require_key(&db)?;
    client.add_favorite(&key, id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn remove_favorite(client: State<'_, NhDesktopClient>, db: State<'_, Db>, id: u64) -> Result<FavoriteResponse, String> {
    let key = require_key(&db)?;
    client.remove_favorite(&key, id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_favorites(client: State<'_, NhDesktopClient>, db: State<'_, Db>, query: Option<String>, page: Option<u32>) -> Result<GalleryList, String> {
    let key = require_key(&db)?;
    client.my_favorites(&key, query.as_deref().unwrap_or(""), page.unwrap_or(1)).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn fetch_account_blacklist(client: State<'_, NhDesktopClient>, db: State<'_, Db>) -> Result<crate::nh_desktop::BlacklistListResponse, String> {
    let key = require_key(&db)?;
    client.blacklist(&key).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_account_blacklist(client: State<'_, NhDesktopClient>, db: State<'_, Db>, added: Vec<u64>, removed: Vec<u64>) -> Result<serde_json::Value, String> {
    let key = require_key(&db)?;
    client.update_blacklist(&key, &added, &removed).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn service_enqueue_download(service: State<'_, Arc<BackgroundService>>, id: u64, format: Option<String>) -> Result<u64, String> {
    service.enqueue_download(id, format.unwrap_or_else(|| "zip".to_string())).await
}

#[tauri::command]
pub async fn service_enqueue_prefetch(service: State<'_, Arc<BackgroundService>>, urls: Vec<String>) -> Result<u64, String> {
    service.enqueue_prefetch(urls).await
}

#[tauri::command]
pub async fn service_enqueue_maintenance(service: State<'_, Arc<BackgroundService>>) -> Result<u64, String> {
    service.enqueue_maintenance().await
}

#[tauri::command]
pub async fn service_enqueue_sync(service: State<'_, Arc<BackgroundService>>) -> Result<u64, String> {
    service.enqueue_sync().await
}

#[tauri::command]
pub fn service_status(service: State<'_, Arc<BackgroundService>>) -> ServiceStatus {
    service.status()
}

#[tauri::command]
pub fn service_set_auto_refresh(db: State<'_, Db>, enabled: bool, interval_minutes: u32) -> Result<(), String> {
    let cfg = AutoRefreshConfig {
        enabled,
        interval_minutes: interval_minutes.max(15),
    };
    set_auto_refresh(&db, &cfg)
}

#[tauri::command]
pub fn service_get_auto_refresh(db: State<'_, Db>) -> AutoRefreshConfig {
    get_auto_refresh(&db)
}

#[tauri::command]
pub fn service_get_downloads_dir(app: tauri::AppHandle, db: State<'_, Db>) -> String {
    let default = crate::resolve_default_downloads_dir(&app);
    crate::service::get_downloads_dir(&db)
        .unwrap_or(default)
        .to_string_lossy()
        .into_owned()
}

#[tauri::command]
pub fn service_set_downloads_dir(db: State<'_, Db>, dir: String) -> Result<(), String> {
    crate::service::set_downloads_dir(&db, &dir)
}

#[tauri::command]
pub fn service_reset_downloads_dir(db: State<'_, Db>) -> Result<(), String> {
    db.del(crate::service::DOWNLOADS_DIR_KEY)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn open_downloads_folder(app: tauri::AppHandle, db: State<'_, Db>) -> Result<(), String> {
    let dir = crate::service::get_downloads_dir(&db)
        .unwrap_or_else(|| crate::resolve_default_downloads_dir(&app));
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let dir_str = dir.to_string_lossy();
    tauri_plugin_opener::OpenerExt::opener(&app)
        .open_path(dir_str.to_string(), None::<&str>)
        .map_err(|e| e.to_string())
}

#[derive(Serialize)]
pub struct StorageStats {
    pub image_cache_bytes: u64,
    pub image_cache_files: usize,
    pub db_size_bytes: u64,
    pub db_cache_entries: usize,
    pub cache_budget_mb: u64,
}

#[tauri::command]
pub fn get_storage_stats(
    cache: State<'_, Arc<ImageCache>>,
    db: State<'_, Db>,
) -> Result<StorageStats, String> {
    let image_cache_bytes = cache.size_bytes();
    let image_cache_files = cache.file_count();
    let db_size_bytes = db.file_size_bytes();
    let db_cache_entries = db.cache_count().unwrap_or(0);
    let cache_budget_mb = crate::service::get_cache_budget(&db);
    Ok(StorageStats {
        image_cache_bytes,
        image_cache_files,
        db_size_bytes,
        db_cache_entries,
        cache_budget_mb,
    })
}

#[tauri::command]
pub fn set_cache_budget(db: State<'_, Db>, mb: u64) -> Result<(), String> {
    crate::service::set_cache_budget(&db, mb)
}

#[tauri::command]
pub fn clear_image_cache(cache: State<'_, Arc<ImageCache>>) -> usize {
    cache.clear()
}

#[tauri::command]
pub fn clear_query_cache(db: State<'_, Db>) -> Result<usize, String> {
    db.clear_cache().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn optimize_storage(cache: State<'_, Arc<ImageCache>>, db: State<'_, Db>) -> Result<String, String> {
    let budget_mb = crate::service::get_cache_budget(&db);
    let removed_images = if budget_mb > 0 {
        cache.prune_lru(budget_mb * 1024 * 1024)
    } else {
        0
    };
    db.vacuum().map_err(|e| e.to_string())?;
    Ok(format!("Optimized: pruned {removed_images} images, compacted database"))
}

#[derive(Serialize, serde::Deserialize, Clone, Debug)]
pub struct DownloadedGalleryItem {
    pub id: u64,
    pub title: String,
    pub format: String,
    pub file_size: u64,
    pub total_pages: usize,
    pub file_path: String,
}

#[derive(Serialize, serde::Deserialize, Clone, Debug)]
pub struct DownloadedGalleryDetail {
    pub id: u64,
    pub title: String,
    pub format: String,
    pub file_size: u64,
    pub total_pages: usize,
    pub pages: Vec<String>,
}

fn is_archive_image_entry(name: &str) -> bool {
    let lower = name.to_lowercase();
    if lower.starts_with('.') || lower.contains("__macosx") {
        return false;
    }
    let p = std::path::Path::new(name);
    let ext = p.extension().and_then(|e| e.to_str()).unwrap_or("").to_lowercase();
    matches!(ext.as_str(), "jpg" | "jpeg" | "png" | "webp" | "gif" | "avif")
}

fn entry_natural_key(name: &str) -> (u32, String) {
    let filename = std::path::Path::new(name)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or(name);
    let stem = std::path::Path::new(filename)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or(filename);
    let digits = stem.chars().filter(|c| c.is_ascii_digit()).collect::<String>();
    let num = digits.parse::<u32>().unwrap_or(u32::MAX);
    (num, filename.to_lowercase())
}

fn get_archive_path_for_id(downloads_dir: &std::path::Path, id: u64) -> Option<(std::path::PathBuf, String)> {
    let zip_path = downloads_dir.join(format!("gallery-{id}.zip"));
    if zip_path.is_file() {
        return Some((zip_path, "zip".to_string()));
    }
    let cbz_path = downloads_dir.join(format!("gallery-{id}.cbz"));
    if cbz_path.is_file() {
        return Some((cbz_path, "cbz".to_string()));
    }
    None
}

#[tauri::command]
pub fn get_downloaded_galleries(app: tauri::AppHandle, db: State<'_, Db>) -> Result<Vec<DownloadedGalleryItem>, String> {
    let dir = crate::service::get_downloads_dir(&db)
        .unwrap_or_else(|| crate::resolve_default_downloads_dir(&app));
    if !dir.is_dir() {
        return Ok(Vec::new());
    }

    let read_dir = std::fs::read_dir(&dir).map_err(|e| e.to_string())?;
    let mut items = Vec::new();

    for entry in read_dir.flatten() {
        let path = entry.path();
        if !path.is_file() {
            continue;
        }
        let file_name = match path.file_name().and_then(|n| n.to_str()) {
            Some(n) => n,
            None => continue,
        };

        let (id_str, format) = if let Some(rest) = file_name.strip_prefix("gallery-") {
            if let Some(id_part) = rest.strip_suffix(".zip") {
                (id_part, "zip")
            } else if let Some(id_part) = rest.strip_suffix(".cbz") {
                (id_part, "cbz")
            } else {
                continue;
            }
        } else {
            continue;
        };

        let id: u64 = match id_str.parse() {
            Ok(val) => val,
            Err(_) => continue,
        };

        let metadata = match entry.metadata() {
            Ok(m) => m,
            Err(_) => continue,
        };

        let file_size = metadata.len();

        let title = if let Ok(Some(cached_json)) = db.get(&format!("cache:gallery:{id}:favorite")) {
            if let Ok(detail) = serde_json::from_str::<serde_json::Value>(&cached_json) {
                detail.get("title")
                    .and_then(|t| t.get("english").or_else(|| t.get("japanese")).or_else(|| t.get("pretty")))
                    .and_then(|v| v.as_str())
                    .unwrap_or(&format!("Gallery #{id}"))
                    .to_string()
            } else {
                format!("Gallery #{id}")
            }
        } else {
            format!("Gallery #{id}")
        };

        let total_pages = if let Ok(file) = std::fs::File::open(&path) {
            if let Ok(mut archive) = zip::ZipArchive::new(file) {
                let mut count = 0;
                for i in 0..archive.len() {
                    if let Ok(f) = archive.by_index(i) {
                        if is_archive_image_entry(f.name()) {
                            count += 1;
                        }
                    }
                }
                count
            } else {
                0
            }
        } else {
            0
        };

        items.push(DownloadedGalleryItem {
            id,
            title,
            format: format.to_string(),
            file_size,
            total_pages,
            file_path: path.to_string_lossy().into_owned(),
        });
    }

    items.sort_by(|a, b| b.id.cmp(&a.id));
    Ok(items)
}

#[tauri::command]
pub fn get_downloaded_gallery_page(
    app: tauri::AppHandle,
    db: State<'_, Db>,
    id: u64,
    page_index: usize,
) -> Result<Vec<u8>, String> {
    use std::io::Read;

    let dir = crate::service::get_downloads_dir(&db)
        .unwrap_or_else(|| crate::resolve_default_downloads_dir(&app));
    let (archive_path, _) = get_archive_path_for_id(&dir, id)
        .ok_or_else(|| format!("Archive for gallery {id} not found"))?;

    let file = std::fs::File::open(&archive_path).map_err(|e| e.to_string())?;
    let mut archive = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;

    let mut image_entries: Vec<String> = Vec::new();
    for i in 0..archive.len() {
        if let Ok(entry) = archive.by_index(i) {
            if is_archive_image_entry(entry.name()) {
                image_entries.push(entry.name().to_string());
            }
        }
    }

    image_entries.sort_by_cached_key(|name| entry_natural_key(name));

    let entry_name = image_entries
        .get(page_index)
        .ok_or_else(|| format!("Page {page_index} not found in archive for gallery {id}"))?;

    let mut entry_file = archive.by_name(entry_name).map_err(|e| e.to_string())?;
    let mut bytes = Vec::with_capacity(entry_file.size() as usize);
    entry_file.read_to_end(&mut bytes).map_err(|e| e.to_string())?;

    Ok(bytes)
}

#[tauri::command]
pub fn get_downloaded_gallery_info(
    app: tauri::AppHandle,
    db: State<'_, Db>,
    id: u64,
) -> Result<DownloadedGalleryDetail, String> {
    let dir = crate::service::get_downloads_dir(&db)
        .unwrap_or_else(|| crate::resolve_default_downloads_dir(&app));
    let (archive_path, format) = get_archive_path_for_id(&dir, id)
        .ok_or_else(|| format!("Archive for gallery {id} not found"))?;

    let metadata = std::fs::metadata(&archive_path).map_err(|e| e.to_string())?;
    let file = std::fs::File::open(&archive_path).map_err(|e| e.to_string())?;
    let mut archive = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;

    let mut image_entries: Vec<String> = Vec::new();
    for i in 0..archive.len() {
        if let Ok(entry) = archive.by_index(i) {
            if is_archive_image_entry(entry.name()) {
                image_entries.push(entry.name().to_string());
            }
        }
    }

    image_entries.sort_by_cached_key(|name| entry_natural_key(name));

    let title = if let Ok(Some(cached_json)) = db.get(&format!("cache:gallery:{id}:favorite")) {
        if let Ok(detail) = serde_json::from_str::<serde_json::Value>(&cached_json) {
            detail.get("title")
                .and_then(|t| t.get("english").or_else(|| t.get("japanese")).or_else(|| t.get("pretty")))
                .and_then(|v| v.as_str())
                .unwrap_or(&format!("Gallery #{id}"))
                .to_string()
        } else {
            format!("Gallery #{id}")
        }
    } else {
        format!("Gallery #{id}")
    };

    Ok(DownloadedGalleryDetail {
        id,
        title,
        format,
        file_size: metadata.len(),
        total_pages: image_entries.len(),
        pages: image_entries,
    })
}

#[tauri::command]
pub fn has_downloaded_gallery(
    app: tauri::AppHandle,
    db: State<'_, Db>,
    id: u64,
) -> bool {
    let dir = crate::service::get_downloads_dir(&db)
        .unwrap_or_else(|| crate::resolve_default_downloads_dir(&app));
    get_archive_path_for_id(&dir, id).is_some()
}

#[tauri::command]
pub fn delete_downloaded_gallery(
    app: tauri::AppHandle,
    db: State<'_, Db>,
    id: u64,
) -> Result<(), String> {
    let dir = crate::service::get_downloads_dir(&db)
        .unwrap_or_else(|| crate::resolve_default_downloads_dir(&app));
    if let Some((archive_path, _)) = get_archive_path_for_id(&dir, id) {
        std::fs::remove_file(archive_path).map_err(|e| e.to_string())?;
    }
    Ok(())
}