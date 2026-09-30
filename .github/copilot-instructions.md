# Copilot instructions — NH Desktop

Auto-loaded by GitHub Copilot. `AGENTS.md` at the repo root is the fuller authority; this
file is the short form for a copilot that will not traverse into `.agents/`.

## Project

**NH Desktop** — a cross-platform desktop client for **nhentai.net** (Tauri 2 + SvelteKit
SPA + Svelte 5 runes + TypeScript `strict` + Rust). Desktop only.

**Identity trap:** the folder is `lewd-clips-app`, which is a misnomer. The product is
**NH Desktop**; all identifiers are `nh-desktop` (Rust: `nh_desktop_lib`,
`nh_desktop.rs`, `NhDesktopClient`). `nhentai` names the *website* and belongs in API
URLs, host allowlists, and user agent strings — never in the app's own name.

## Hard rules

1. **No comments in code.** No explanatory comments, no commented-out code. Allowed: the
   license header, `// @ts-expect-error <reason>`, and doc comments on exported public
   API.
2. **Never commit, push, tag, or open a PR** unless the user asked for that exact action.
   Stage only the files for the requested work — never `git add .`.
3. **Never report a task done** without having run the check and read its output.
4. **All nhentai traffic originates in Rust** (`reqwest`, behind Tauri commands). The
   webview never calls `fetch` against nhentai.
5. **Throttle every request.** No hammering, no unbounded parallel fan-out. Honour
   `Retry-After` on 429/5xx.
6. **No secrets in code.** The API key is never logged, never in a URL query string, never
   committed.
7. **Svelte 5 runes** (`$state`, `$derived`, `$effect`, `$props`) — no `export let`, no
   `on:` handlers, no `$:` labels. Components `PascalCase`, modules and routes
   `kebab-case`.
8. **Rust** is `snake_case`, every Tauri command returns `Result<T, AppError>`, no `unwrap`
   or `expect` outside tests, no panics across the command boundary.
9. **Styling** is plain CSS using the custom properties in `src/lib/design/tokens.css`.
   No CSS framework, no utility library, no hardcoded colour or spacing when a token
   exists.
10. **All user-visible strings come from the i18n packs** in `src/lib/i18n/` — never
    literals in markup. Four packs stay in sync: `en`, `ja`, `zh-Hans`, `zh-Hant`.
11. **Keep the ledgers true.** Behaviour change → `CHANGELOG.md`. Task done → close its
    `TODO.md` row. Bug found or fixed → update `BUGS.md`. Same change, not afterwards.
12. **Image URLs are built from the API's relative fragments** (`joinUrl` in
    `src/lib/image.ts`). API v2 returns `galleries/<id>/thumb.webp` with **no leading
    slash** — never blind-concatenate a host.
13. **This shell has no TTY.** No `vim`/`less`/`man`, no `git add -p` or `git rebase -i`,
    no bare `git log`. Use `--no-pager`, `-m`, `--no-edit`. If a command needs a password,
    stop and report — never pipe credentials.

## Verify before declaring done

| Changed | Run |
| --- | --- |
| `src/**`, `.svelte`, `.css` | `npm run check` |
| `src-tauri/**`, `.rs` | `cargo check` and `cargo test` in `src-tauri/` |
| `src/lib/i18n/**` or any new string | `npm run i18n:check` |
| `.agents/**`, `AGENTS.md`, `.opencode/**` | `npm run check:agents` |

`npm run check:agents` is the gate for this instruction file and the `.agents/` tree. Run
it on any change to them.

## Layout

```
src/lib/            flat modules: api, client, types, query, image, format, cache
src/lib/components/ PascalCase .svelte
src/lib/stores/     *.svelte.ts rune stores
src/lib/i18n/       en, ja, zh-Hans, zh-Hant
src/lib/design/     tokens.css, base.css
src-tauri/src/      main, lib, nh_desktop, commands, error, db, service,
                    image_cache, installer, platform/
.agents/            ROLES.md, rules/, agents/{primary}/{sub}/, skills/, templates/
```

## Deeper rules

Trigerring rules live in `.agents/rules/` — `frontend.md`, `backend.md`, `security.md`,
`i18n.md`, `installer.md`, `identity.md`, `doc-truthfulness.md`. Workflows live in
`.agents/skills/`. Read them when the trigger in `AGENTS.md` §3 fires.
