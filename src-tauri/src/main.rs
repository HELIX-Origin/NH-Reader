#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::ExitCode;

fn main() -> ExitCode {
    let args: Vec<String> = std::env::args().collect();
    let exe_path = std::env::current_exe().ok();
    let exe_name = exe_path
        .as_ref()
        .and_then(|p| p.file_name().map(|n| n.to_string_lossy().to_lowercase()))
        .unwrap_or_default();

    let lower = exe_name.to_lowercase();

    #[cfg(target_os = "windows")]
    if lower.contains("uninstall") && !args.iter().any(|a| a == "--from-temp") {
        if let Some(path) = exe_path.as_ref() {
            let temp_dir = std::env::temp_dir().join("nh-desktop-uninstall");
            if std::fs::create_dir_all(&temp_dir).is_ok() {
                let temp_exe = temp_dir.join("uninstall.exe");
                if std::fs::copy(path, &temp_exe).is_ok() {
                    let mut cmd = std::process::Command::new(&temp_exe);
                    cmd.arg("--from-temp");
                    if !args.iter().any(|a| a == "--target-dir") {
                        if let Some(parent) = path.parent() {
                            cmd.arg("--target-dir");
                            cmd.arg(parent.to_string_lossy().as_ref());
                        }
                    }
                    for arg in args.iter().skip(1) {
                        cmd.arg(arg);
                    }
                    if cmd.spawn().is_ok() {
                        return ExitCode::SUCCESS;
                    }
                }
            }
        }
    }

    if args.iter().any(|a| a == "--from-temp") {
        std::thread::sleep(std::time::Duration::from_millis(300));
    }

    if lower.contains("installer")
        || lower.contains("setup")
        || lower.contains("uninstall")
        || args.iter().any(|a| a == "--installer" || a == "--setup" || a == "--uninstall" || a == "--maintenance")
    {
        nh_desktop_lib::run_installer();
        return ExitCode::SUCCESS;
    }
    nh_desktop_lib::run();
    ExitCode::SUCCESS
}