# Rule: Installer and packaging

**Status:** MANDATORY
**Triggers:** editing `tauri.conf.json` bundling, or anything about packaging / installers
**Enforced by:** `npm run check:agents` + `npm run build:app`

## Must

- **Use Tauri native packaging for desktop installers.** Native NSIS (`.exe`) and WiX MSI (`.msi`) on Windows, DMG on macOS, and deb/AppImage on Linux.
- **Support both release and debug native builds.** `npm run build:app` (`tauri build`) and `npm run build:app:debug` (`tauri build --debug`), as well as cargo equivalents (`cargo tauri build`).
- **Portable mode runtime isolation.** When `.portable` marker or `data/` directory exists adjacent to the executable, application database, cache, and downloads stay self-contained inside that folder.
- **Clean system uninstaller.** Native installers manage registration with Windows "Apps & features" / system uninstallation mechanisms.

## Never

- Never fetch nhentai from webview or bypass Rust IPC.
- Never hardcode user paths; use Tauri's path resolution APIs.
- Never ship installers that omit production webview assets.

## Verify

`npm run check:agents`, `cargo check` and `cargo test` in `src-tauri/`, plus `npm run build:app`.
