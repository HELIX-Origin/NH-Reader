# Rule: Identity

**Status:** MANDATORY — always in force
**Triggers:** any naming, branding, title, window/exe string, package name, or doc prose
**Enforced by:** review

## Must

- The product is **NH Desktop**. The workspace folder `lewd-clips-app` is a misnomer. Never
  derive a name, title, or identifier from the folder.
- User-facing strings are exactly `NH Desktop` — window title, `productName` in
  `tauri.conf.json`, exe, install dir `Programs\NH Desktop`, shortcut and registry
  `DisplayName`. Publisher/author is `HELIX Origin`.
- Identifiers are lowercase-hyphen `nh-desktop`, except where the language forces
  underscores:

  | Where | Form |
  | --- | --- |
  | cargo package | `nh-desktop` |
  | Rust lib crate | `nh_desktop_lib` |
  | Rust module / type | `nh_desktop` / `NhDesktopClient` |
  | npm package | `nh-desktop` |
  | bundle ID | `net.nh-desktop.client` |
  | cache key prefix | `nh-desktop:` |
  | database file | `nh-desktop.db` |

- `nhentai` and `nhentai.net` name the **website**, not the app. They are correct in API
  URLs, image-host allowlists, user agent strings, and citations. They are wrong in the
  product's own name.

## Never

- Never name the app "nhentai", "NHentai", "NClient", or the folder name.
- Never introduce a second spelling of the product name in a new file.

## Change protocol

Renaming anything load-bearing means touching, in one change: `tauri.conf.json`,
`Cargo.toml`, `package.json`, the CSP/identifier literals in `src-tauri/src/**`, and the
`## 7. Decision log` in `AGENTS.md`.
