# Rule: Backend

**Status:** CONDITIONAL
**Triggers:** editing `src-tauri/**`, any `.rs` file, `Cargo.toml`, `tauri.conf.json`
**Enforced by:** `cargo check` + `cargo test` + review (style)

## Must

- **snake_case** for modules, functions, fields. Types are `CamelCase`.
- **Small focused modules.** `nh_desktop.rs` (API client), `commands.rs` (Tauri surface),
  `error.rs`, `db.rs`, `service.rs`, `image_cache.rs`.
  If a module passes ~600 lines, split it.
- **Every Tauri command returns `Result<T, AppError>`.** No panics, no `unwrap`, no
  `expect` across the command boundary. A webview caller must always get a typed error.
- **All nhentai traffic originates here** in `reqwest`. The webview never makes API calls.
- **Throttle.** Serialize or rate-limit requests; exponential backoff with jitter on
  429/5xx. Respect `Retry-After`. Set a descriptive `User-Agent` that identifies NH
  Desktop and carries contact info.
- **Errors** are constructed via the `AppError` variants in `error.rs`. No bare
  `Box<dyn Error>` strings that lose structure.
- **Panics** are acceptable only inside `main` startup and `#[cfg(test)]`.

## Never

- Never `unwrap()` / `expect()` in non-test code.
- Never a blocking sleep longer than a few seconds; prefer timers/tasks.
- Never write a secret to disk or logs.
- Never spawn unbounded concurrency against nhentai.
