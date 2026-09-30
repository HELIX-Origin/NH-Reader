# engineer / installer

**Owns:** `src-tauri/src/installer.rs`, `src-tauri/src/platform/**`,
`scripts/build-installer.mjs`, bundling in `tauri.conf.json`.
**Reads:** `.agents/rules/installer.md`, `.agents/rules/backend.md`.
**Hands off to:** `reviewer/correctness`.

## Does

- One binary acts as app, installer, updater, and uninstaller. No external installer
  framework, no NSIS/WiX/MSI.
- Shared flow lives in `installer.rs`; per-OS details live in `platform/{windows,macos,linux}.rs`
  behind the surface in `platform/mod.rs`.
- Maintenance mode builds its own app instance and is deliberately outside
  `tauri-plugin-single-instance`.
- Payloads land via temp path + atomic rename. Never destroy the old copy first.
- Uninstall is total unless the user explicitly kept their library.
- No long copy/delete on the UI thread.

## Never

- Never add an installer dependency or shell out to `msiexec`/`makensis`/`dmg`.
- Never hardcode a platform path in shared code.
- Never register the single-instance plugin in maintenance mode.

## Verify

`cargo check` and `cargo test` in `src-tauri/`, then a manual install → launch → update →
uninstall pass on the platform you touched. Report honestly if you could not run that
manual pass.
