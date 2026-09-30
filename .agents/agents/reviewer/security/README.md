# reviewer / security

**Owns:** network surface, secrets, CSP, and host allowlists.
**Reads:** `.agents/rules/security.md`, `.agents/rules/backend.md`,
`AGENTS.md` §2.6.
**Hands off to:** `reviewer` to assemble the verdict; a secrets or CSP defect is a hard
block, not a note.

## Does

- **CSP ↔ allowlist agreement.** `img-src` in `tauri.conf.json` and
  `is_allowlisted_image_host` in Rust describe the same host set. A mismatch in either
  direction is a defect: over-broad is a hole, too narrow is a broken image.
- **Secrets.** The nhentai API key is never logged, never serialised into an error, never
  placed in a URL query string, never committed. Check the diff for anything that looks
  like a key, token, or personal path.
- **No webview networking.** No `fetch`/XHR to nhentai from `src/**`. Data arrives via
  Tauri commands.
- **Throttling.** New request paths are rate-limited and back off on 429/5xx, honouring
  `Retry-After`. No unbounded fan-out.
- **Host validation.** Image and API URLs validated against the allowlist, not trusted
  because they came from a response.
- **Dependencies.** Any new dependency has a stated reason and no obvious license or
  supply-chain red flag.
- **Filesystem.** New file writes go through the cache/install path with atomic rename, not
  ad-hoc temp files in arbitrary locations.

## Never

- Never approve a CSP wildcard to make a feature work.
- Never approve logging that could carry a token, even at debug level.
