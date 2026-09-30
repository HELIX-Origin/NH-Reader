# Rule: Installer and packaging

**Status:** CONDITIONAL
**Triggers:** editing `src-tauri/src/installer.rs`, `src-tauri/src/platform/**`,
`scripts/build-installer.mjs`, `tauri.conf.json` bundling, or anything about install /
uninstall / update
**Enforced by:** `cargo check` + review

## Must

- **One binary is both app and installer.** No NSIS, no WiX, no MSI, no external
  installer framework. Maintenance mode is the same Rust code path, keyed off a flag
  passed by the build script.
- **Dedicated uninstaller executable.** Deploys `uninstall.exe` on Windows (`uninstall` on
  Linux) alongside the app binary, executing from temp on invocation to avoid locking
  files so the installation directory can be completely deleted.
- **Platform differences go in `src-tauri/src/platform/{windows,macos,linux}.rs`**, behind
  the shared surface in `platform/mod.rs`. `installer.rs` holds the shared flow only.
- **The single-instance plugin does not cover installer/maintenance mode.** That mode
  builds and runs its own app instance on purpose. Do not "fix" this by registering the
  plugin there.
- **Path handling is per-platform.** Use the platform module, never a hardcoded
  `C:\`/`/Users` assumption in shared code.
- **Never remove a downloaded payload before the new one is in place.** Write to a temp
  path, then rename atomically.
- **Uninstall is total.** Leaving cache, settings, or the SQLite db behind after an
  explicit uninstall is a bug unless the user kept their library deliberately.

## Never

- Never introduce an external installer dependency.
- Never shell out to `msiexec`, `makensis`, or `dmg` from Rust.
- Never assume Windows for a step that runs on macOS or Linux.
- Never block the UI thread on a long copy or delete.

## Verify

`cargo check` and `cargo test` in `src-tauri/`, plus a manual pass of install → launch →
update → uninstall on the platform you touched.
