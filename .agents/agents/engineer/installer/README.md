# engineer / installer

**Owns:** Packaging and bundling in `src-tauri/tauri.conf.json`.
**Reads:** `.agents/rules/installer.md`, `.agents/rules/backend.md`.
**Hands off to:** `reviewer/correctness`.

## Does

- Manages Tauri native installer bundles (NSIS `.exe` and WiX `.msi` on Windows, DMG on macOS, deb/AppImage on Linux).
- Packages portable releases: portable `.zip` archives.
- Supports both release (`npm run tauri:build:release`) and debug (`npm run tauri:build:debug`) packaging.
- Ensures all production webview resources are completely bundled and load properly.

## Never

- Never break native packaging or portable runtime isolation.
- Never omit production webview assets from release builds.
- Never violate the identity trap.

## Verify

`npm run check:agents`, `cargo check` and `cargo test` in `src-tauri/`, and `npm run tauri:build:release`.
