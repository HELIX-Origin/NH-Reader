# Rule: Security

**Status:** MANDATORY for network/auth changes, CONDITIONAL otherwise
**Triggers:** any new HTTP call, CSP edit, API key handling, image host, or new dependency
**Enforced by:** review

## Must

- **CSP and the Rust image allowlist must agree.** The `img-src` list in
  `tauri.conf.json` and `is_allowlisted_image_host` in `src-tauri/src/nh_desktop.rs`
  describe the same set: any `*.nhentai.net`, including `static.nhentai.net` for avatars.
  Change one → change the other in the same commit.
- **Image URLs are built by `joinUrl` in `src/lib/image.ts`** from the API's *relative*
  path fragments. nhentai API v2 returns `galleries/<id>/thumb.webp` with **no leading
  slash**. Never blind-concatenate a host with an API path.
- **The nhentai API key is a user secret.** Read it through the settings/account store,
  keep it in the SQLite KV cache like any other setting, never log it, never put it in a
  URL query string, never commit it, never echo it into an error message.
- **New dependencies** need a stated reason in the PR body. Prefer the platform over a
  crate.
- **Rate limits are a security property.** See `.agents/rules/backend.md` throttling.

## Never

- Never log or serialise the API key, cookies, or auth headers.
- Never widen the CSP `img-src`/`connect-src` to a wildcard to make something work.
- Never fetch nhentai from the webview.
- Never disable certificate validation.
- Never ship a `.env` with real values.
