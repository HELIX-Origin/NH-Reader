mod commands;
mod db;
mod error;
mod image_cache;
mod nh_desktop;
mod service;

use db::Db;
use image_cache::ImageCache;
use nh_desktop::NhDesktopClient;
use service::BackgroundService;
use std::path::PathBuf;
use std::sync::Arc;
use tauri::Manager;

fn detect_portable_dir(exe: &std::path::Path) -> Option<PathBuf> {
    let parent = exe.parent()?;
    if parent.join(".portable").exists() || parent.join("data").is_dir() {
        return Some(parent.join("data"));
    }
    for ancestor in parent.ancestors().skip(1).take(4) {
        if ancestor.join(".portable").exists() || ancestor.join("data").is_dir() {
            return Some(ancestor.join("data"));
        }
    }
    None
}

pub fn resolve_app_data_dir<M: Manager<R>, R: tauri::Runtime>(manager: &M) -> Result<PathBuf, Box<dyn std::error::Error>> {
    if let Ok(exe) = std::env::current_exe() {
        if let Some(data_dir) = detect_portable_dir(&exe) {
            let _ = std::fs::create_dir_all(&data_dir);
            return Ok(data_dir);
        }
    }
    Ok(manager.path().app_data_dir()?)
}

pub fn resolve_default_downloads_dir<M: Manager<R>, R: tauri::Runtime>(manager: &M) -> PathBuf {
    if let Ok(exe) = std::env::current_exe() {
        if let Some(data_dir) = detect_portable_dir(&exe) {
            let p = data_dir.join("downloads");
            let _ = std::fs::create_dir_all(&p);
            return p;
        }
    }
    let data_dir = manager
        .path()
        .app_data_dir()
        .unwrap_or_else(|_| std::env::temp_dir());
    manager
        .path()
        .document_dir()
        .unwrap_or(data_dir)
        .join("NH Reader")
        .join("downloads")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init());

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }));
    }

    let result = builder
        .setup(|app| {
            let data_dir = resolve_app_data_dir(app)?;
            let default_downloads_dir = resolve_default_downloads_dir(app);

            let client = NhDesktopClient::new()?;
            app.manage(client.clone());
            app.manage(Db::new(&data_dir.join("database.sqlite"))?);

            let cache = Arc::new(ImageCache::new(data_dir.join("cache/images")));
            app.manage(cache.clone());

            let service = BackgroundService::spawn(
                app.handle().clone(),
                client,
                cache,
                &data_dir.join("database.sqlite"),
                default_downloads_dir,
            );
            app.manage(service);

            #[cfg(desktop)]
            {
                use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
                use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};

                let show_i = MenuItem::with_id(app, "show", "Show NH Reader", true, None::<&str>)?;
                let min_i = MenuItem::with_id(app, "minimize", "Minimize to Tray", true, None::<&str>)?;
                let sep = PredefinedMenuItem::separator(app)?;
                let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

                let menu = Menu::with_items(app, &[&show_i, &min_i, &sep, &quit_i])?;

                let mut tray_builder = TrayIconBuilder::with_id("main")
                    .menu(&menu)
                    .show_menu_on_left_click(false)
                    .tooltip("NH Reader")
                    .on_menu_event(|app, event| match event.id().as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                        }
                        "minimize" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.hide();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    })
                    .on_tray_icon_event(|tray, event| {
                        if let TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } = event
                        {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                if window.is_visible().unwrap_or(false) {
                                    let _ = window.hide();
                                } else {
                                    let _ = window.show();
                                    let _ = window.unminimize();
                                    let _ = window.set_focus();
                                }
                            }
                        }
                    });

                let tray_icon =
                    tauri::image::Image::from_bytes(include_bytes!("../icons/tray-icon.png")).ok();
                if let Some(icon) = tray_icon.or_else(|| app.default_window_icon().cloned()) {
                    tray_builder = tray_builder.icon(icon);
                }

                let _ = tray_builder.build(app);
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            #[cfg(desktop)]
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                if window.label() == "main" {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::fetch_new,
            commands::fetch_popular,
            commands::fetch_tagged,
            commands::search_galleries,
            commands::fetch_gallery,
            commands::related_galleries,
            commands::fetch_tag_info,
            commands::fetch_tags_by_type,
            commands::proxy_image,
            commands::db_get,
            commands::db_set,
            commands::db_del,
            commands::db_dump,
            commands::db_clear,
            commands::set_api_key,
            commands::get_api_key_status,
            commands::clear_api_key,
            commands::verify_api_key,
            commands::get_current_user,
            commands::login_account,
            commands::check_favorite,
            commands::add_favorite,
            commands::remove_favorite,
            commands::fetch_favorites,
            commands::fetch_account_blacklist,
            commands::update_account_blacklist,
            commands::service_enqueue_download,
            commands::service_enqueue_prefetch,
            commands::service_enqueue_maintenance,
            commands::service_enqueue_sync,
            commands::service_status,
            commands::service_set_auto_refresh,
            commands::service_get_auto_refresh,
            commands::service_get_downloads_dir,
            commands::service_set_downloads_dir,
            commands::service_reset_downloads_dir,
            commands::open_downloads_folder,
            commands::get_downloaded_galleries,
            commands::get_downloaded_gallery_page,
            commands::get_downloaded_gallery_info,
            commands::has_downloaded_gallery,
            commands::delete_downloaded_gallery,
            commands::get_storage_stats,
            commands::set_cache_budget,
            commands::clear_image_cache,
            commands::clear_query_cache,
            commands::optimize_storage,
            commands::app_quit,
            commands::get_system_locale,
        ])
        .run(tauri::generate_context!());
        if result.is_err() {
            std::process::exit(1);
        }
}