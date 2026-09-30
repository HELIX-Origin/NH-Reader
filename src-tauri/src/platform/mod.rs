#[cfg(target_os = "windows")]
mod windows;
#[cfg(target_os = "windows")]
pub use windows::*;

#[cfg(target_os = "macos")]
mod macos;
#[cfg(target_os = "macos")]
pub use macos::*;

#[cfg(target_os = "linux")]
mod linux;
#[cfg(target_os = "linux")]
pub use linux::*;

use std::path::Path;

pub fn nearest_existing_dir(path: &Path) -> std::path::PathBuf {
    let mut probe = path.to_path_buf();
    loop {
        if probe.exists() {
            return probe;
        }
        match probe.parent() {
            Some(parent) => probe = parent.to_path_buf(),
            None => return probe,
        }
    }
}