# NH Desktop v0.4.0

**Release date:** 2026-09-30

## ✨ Highlights

NH Desktop v0.4.0 introduces a dedicated uninstaller executable (`uninstall.exe` on Windows) that eliminates file-locking issues during uninstallation, aligns publisher attribution to **HELIX Origin** in system settings, and debuts a streamlined 100% drop-in hand-rolled localization architecture. Hand-rolled English is provided out of the box with system locale fallback, while community members can contribute full language packs by simply dropping in a single JSON file.

## 🚀 Key Improvements & Features

- **Dedicated uninstaller executable** — Deploys an independent `uninstall.exe` (Windows) and `uninstall` (Linux) alongside `NH Desktop.exe`. When launched, the uninstaller relocates to a temporary directory before execution so neither binary holds a file lock on the installation directory, allowing `remove_dir_all` to cleanly remove all application files without permission or sharing errors.
- **Publisher attribution to HELIX Origin** — Windows Add/Remove Programs (installed apps) now displays the correct publisher, `HELIX Origin`, matching the GitHub organization owning the repository.
- **100% drop-in localization architecture** — Replaced the fluent dependency tree with a zero-dependency, high-performance `LocaleCatalog` class using Vite dynamic glob imports. Hand-rolled English (`en.json`) is the default source of truth, with automatic fallback to your operating system locale.
- **Effortless community translations** — Adding a language requires no code modifications or registry edits. Simply drop `<locale>.json` into `src/lib/i18n/` and validate with `npm run i18n:check`.
- **Comprehensive translation contribution guide** — Added full documentation and complete 78-key JSON schema reference with field explanations in `CONTRIBUTING.md`.
- **Hardened SQLite concurrency** — Added mutex poison recovery to database connection handling in `db.rs` (`lock_conn()`), preventing application panics if a mutex lock is poisoned.

## ✅ Changed

- Bumped project version to `0.4.0` across `package.json`, `Cargo.toml`, `tauri.conf.json`, `Cargo.lock`, and sidebar UI.
- Updated Windows registry uninstaller registration to point `UninstallString` directly to `uninstall.exe` with publisher `HELIX Origin`.
- Aligned documentation across `README.md`, `CONTRIBUTING.md`, `ROADMAP.md`, `TODO.md`, and all `wiki/` pages.

## 🐛 Fixed

- **Uninstaller file locking on Windows** — Previously, running the uninstaller from `NH Desktop.exe --installer --maintenance` caused Windows to lock the running executable, preventing `std::fs::remove_dir_all` from deleting program files. The new dedicated `uninstall.exe` executes from temp and cleanly removes the install directory.

## 📦 Install & Upgrading

Download the installer for your platform from the Assets section below:

- Windows: `NH Desktop-Setup-0.4.0-win-x64.exe`
- macOS: `NH Desktop-Setup-0.4.0-macos-arm64` (or `macos-x64` if available)
- Linux: `NH Desktop-Setup-0.4.0-linux-x64`

Upgrade in place: run the new installer over your existing installation. The unified installer will replace files, place the dedicated `uninstall.exe`, and update shortcuts and registry entries.

## Verification

- `cargo check` + `cargo test` (src-tauri) — passed (10/10)
- `npm run check` (svelte-check) — 0 errors, 0 warnings
- `npm run build` — adapter-static site generated successfully
- `npm run i18n:check` — 78/78 keys validated
- `node scripts/check-agents.mjs --all` — whole tree compliant (61 source files)
- `npm run build:installer` — produces `NH Desktop-Setup-0.4.0-win-x64.exe` and `uninstall.exe`

## 📄 Changes & Commits

- `chore(release): bump version to 0.3.0 and prepare release notes`
- `feat(i18n): add localization, language packs, and system-locale default (M9)`
- `fix(installer): defer launch until Finish click; feat(ui): context-aware titlebar search`
- `docs: remove Status column from CHANGELOG.md summary table`
- `docs: expand CHANGELOG.md with detailed sub-bullets`
- `docs: update CHANGELOG.md bullet format to match template`
- `docs: update CHANGELOG.md to latest template format`
- `docs: update CHANGELOG.md commit-link format to match template`
- `docs(templates): update changelog template to match actual CHANGELOG.md format`
- `docs: add CHANGELOG.md following project template`
- `docs(templates): fix changelog template to custom format`

Full commit history: `git log --oneline v0.2.1..v0.3.0`
