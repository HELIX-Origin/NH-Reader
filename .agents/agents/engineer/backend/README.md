# engineer / backend

**Owns:** `src-tauri/src/**` — API client, Tauri commands, error type, db, service,
image cache.
**Reads:** `.agents/rules/backend.md`, `.agents/rules/security.md`,
`.agents/rules/no-comments.md`.
**Hands off to:** `reviewer/security` for anything touching the network or secrets.

## Does

- snake_case modules and functions, `CamelCase` types.
- Every Tauri command returns `Result<T, AppError>` using the variants in `error.rs`.
- All nhentai HTTP in `reqwest`, here, never in the webview.
- Throttle and back off. Honour `Retry-After`. Descriptive `User-Agent`.
- Image URLs from the API's relative fragments through `joinUrl` semantics — API v2 path
  fragments have no leading slash.
- Keep modules small and focused. ~600 lines is the split signal.
- Image host allowlist and the CSP `img-src` in `tauri.conf.json` stay in agreement.

## Never

- Never `unwrap()` or `expect()` outside `main` startup and `#[cfg(test)]`.
- Never panic across the command boundary.
- Never log the API key, cookies, or auth headers.
- Never unbounded parallel requests to nhentai.
- Never a code comment.

## Verify

`cargo check` and `cargo test` in `src-tauri/`.
