# AGENTS.md — NH Reader

**This file is auto-injected into every agent session. Everything under `MANDATORY` below
applies without anyone remembering to read a file. If you are an agent: you are already
bound by it. Do not go looking for permission to skip a line here.**

---

## 1. What this project is

**NH Reader** — a lightweight, cross-platform client for **nhentai.net** with its
own custom UI, built to beat the site at search/filtering and global blacklisting.

| Concern | Choice (locked) |
| --- | --- |
| Desktop shell | Tauri 2 (Rust) |
| Frontend | SvelteKit static SPA (`adapter-static`), Svelte 5 runes, TypeScript `strict` |
| Styling | Plain modern CSS + design tokens — **no** CSS framework |
| Networking | Rust `reqwest` behind Tauri commands — **never** fetch nhentai from the webview |
| Persistence | SQLite-backed KV cache (`src/lib/cache.ts` → `db.rs` → `database.sqlite`) |
| Packaging | Tauri native bundler (NSIS/MSI on Windows, DMG on macOS, deb/AppImage on Linux, APK on Android) + portable zip |
| Package manager | npm |

Cross-platform: Desktop (Windows/macOS/Linux) and Mobile (Android via Tauri 2 native mobile support). Note: Because the maintainer lacks physical macOS and Android devices, Android (as well as macOS) builds are currently community-supported and untested by the maintainer. iOS is not supported.

## 2. ⛔ MANDATORY — these are not negotiable

### 2.1 Identity trap
- The product is **NH Reader**. The workspace folder is named `lewd-clips-app` and that
  is a **misnomer** — never derive naming, branding, titles, or package names from it.
- **User-facing name:** `NH Reader` (exe `NH Reader.exe`, window title `NH Reader`).
- **Publisher / Author:** `HELIX Origin` (GitHub organization owning the project repository).
- **All identifiers use lowercase-hyphen `nh-reader`** — cargo `nh-reader`, lib crate
  `nh_reader_lib`, npm `nh-reader`, bundle ID `net.nh-reader.client`, cache prefix
  `nh-reader:`, db file `database.sqlite` (ambiguous name to isolate persistence from rebranding).
- `nhentai` / `nhentai.net` names the **website** this app talks to. It is fine in API
  URLs, host allowlists, and citations. **Never** brand the app itself as "nhentai".
  → `.agents/rules/identity.md`

### 2.2 No comments in code
Do not add comments to source files unless explicitly asked. Prefer self-documenting
names. The only permitted comments are: the license header, `//` markers that are load-
bearing for tooling (e.g. `@ts-expect-error` with a reason), and doc comments on
**exported public API** in Rust/TS.
→ `.agents/rules/no-comments.md` · **enforced** by `npm run check:agents`

### 2.3 Never commit, push, or open PRs unasked
Do not `git add`, `git commit`, `git push`, `git tag`, or `gh pr create` unless the user
asked for that specific action in this conversation. Editing files is not permission to
commit. `git add` of unrelated pre-existing modifications is forbidden — stage only the
files belonging to the requested work.
→ `.agents/rules/git-workflow.md`

### 2.4 Verify before declaring done — and before pushing
Never report a task complete without having actually run the relevant check in §4 in
this session, and read its output. "Should compile" is not verification.
**Never push to remote until all relevant checks pass in this session.** Unverified or
broken code must never reach the remote. CI workflow changes require end-to-end
dry-run validation (`dry_run: true`) before being pushed.
→ `.agents/rules/verification.md` · **enforced** by `npm run check:agents`

### 2.5 Tracking docs stay true
Update tracking files (`ROADMAP.md`, `TODO.md`) **first** or in lockstep before finishing code changes so they are never forgotten. If behaviour changes, `CHANGELOG.md` gets an entry. If a task is done, its `TODO.md` row is updated in the same change. `BUGS.md` gains or loses rows when bugs are found or fixed. A stale ledger is a bug. Tracking ledgers live at repo root; do not duplicate them (e.g. separate Roadmap) in `docs/`.
→ `.agents/rules/doc-truthfulness.md`

### 2.6 Respect the upstream API
Throttle every request to nhentai. No hammering, no parallel fan-out without backoff, no
scraping endpoints that are not in the public API. A user agent identifies the app.
→ `.agents/rules/security.md`

### 2.7 Headless shell
This shell has no TTY. Banned: `vim`, `nano`, `less`, `more`, `man`, `git add -p`,
`git rebase -i`, bare `git log`. Use `git --no-pager`, `--no-edit`, `-m`. If a command needs
a password or a human choice, **stop and report** — never pipe credentials
(`yes | …`, `echo pw | sudo -S`) and never blanket-approve a prompt. Use `sudo -n`,
`ssh -o BatchMode=yes`, `-y`/`--no-input`.
→ `.agents/rules/headless-shell.md`

## 3. Routing table — read on trigger, not up front

| Trigger | Read |
| --- | --- |
| Touching `src/**`, `.svelte`, `.css` | `.agents/rules/frontend.md` |
| Touching `src-tauri/**`, `.rs`, `Cargo.toml` | `.agents/rules/backend.md` |
| Touching packaging, `tauri.conf.json`, bundles | `.agents/rules/installer.md` |
| Adding user-visible strings, `src/lib/i18n/**` | `.agents/rules/i18n.md` |
| Any new HTTP call, CSP, API key, image host | `.agents/rules/security.md` |
| Naming, branding, product/window/exe strings | `.agents/rules/identity.md` |
| Commit, tag, release, `gh` | `.agents/rules/git-workflow.md` |
| Declaring a task done | `.agents/rules/verification.md` |
| Editing `TODO.md` / `BUGS.md` / `CHANGELOG.md` / `docs/` | `.agents/rules/doc-truthfulness.md` |
| Committing, tagging, cutting a release | `.agents/rules/release.md` |
| DCP `compress` nudges, long sessions | `.agents/rules/context-management.md` |
| Never sure what's true about the project | `.agents/ROLES.md` then `ROADMAP.md` |

## 4. Verification matrix — run what the change touches

| Change touched | Run |
| --- | --- |
| `src/**`, `.svelte`, `.css` | `npm run check` |
| `src-tauri/**`, `.rs` | `cargo check` + `cargo test` (in `src-tauri/`) |
| `src/lib/i18n/**` or user-visible strings | `npm run i18n:check` |
| `.agents/**`, `AGENTS.md`, agent config | `npm run check:agents` |
| Anything | `npm run check:agents` — it is fast and it is the ecosystem's own gate |

Commands:

| Action | Command |
| --- | --- |
| Install deps | `npm install` |
| Run app | `npm run dev:app` (Vite on fixed port **14440**, HMR 14441, `strictPort`) |
| Frontend check | `npm run check` |
| Frontend build | `npm run build` |
| Rust check / test | `cargo check` / `cargo test` (in `src-tauri/`) |
| Agent ecosystem gate | `npm run check:agents` |
| i18n completeness | `npm run i18n:check` |

The dev port is **fixed at 14440** with `strictPort: true`. No port auto-incrementing, no
`scripts/dev.mjs`.

## 5. Layout

```
AGENTS.md                  this file — always loaded, the authority
.agents/
  ROLES.md                 primary + sub agent index
  rules/                   13 standing conventions, each with trigger + enforcement
  agents/{primary}/{sub}/  role specs
  skills/                  6 repeatable workflows
  templates/               8 fill-in templates
.opencode/                 opencode config: instructions wiring, commands, DCP
.github/copilot-instructions.md
scripts/check-agents.mjs   the mechanical gate
src/lib/                   api, client, types, query, image, format, cache (flat modules)
src/lib/components/        PascalCase .svelte
src/lib/stores/            *.svelte.ts runes stores
src/lib/i18n/              drop-in language packs (en default)
src/lib/design/            tokens.css, base.css
src-tauri/src/             main, lib, nh_desktop, commands, error, db, service,
                           image_cache
```

## 6. Headless agent workflows

Load on demand — each is a short, ordered procedure:

| Skill | Use when |
| --- | --- |
| `.agents/skills/onboard.md` | first task in this repo, or you lost the plot |
| `.agents/skills/implement-feature.md` | building something scoped |
| `.agents/skills/fix-bug.md` | something is broken |
| `.agents/skills/review-change.md` | before calling anything done |
| `.agents/skills/update-docs.md` | docs/ledgers out of date |
| `.agents/skills/cut-release.md` | version bump, changelog, tag |

## 7. Decision log

Decisions that are settled. Changing one means updating this log **and** the rule it
came from in the same change.

- **Product name** `NH Reader`; identifiers `nh-reader`, db file `database.sqlite`. Folder name is a misnomer (§2.1).
- **Stack** Tauri 2 + SvelteKit SPA + Svelte 5 runes. Locked.
- **Styling** plain CSS with custom-property tokens. Chosen for full control over the
  custom UI and zero dependencies. Revisit only with a strong argument.
- **Networking** all nhentai traffic originates in Rust (`reqwest`). The webview never
  makes API calls. Images load directly from `*.nhentai.net` via `<img>`, with a Rust
  image-proxy command (`proxy_image`, backed by `image_cache.rs`) as fallback when a
  direct load fails.
- **Image URLs** are derived from the API's *relative* path fragments via
  `joinUrl` in `src/lib/image.ts`. nhentai API v2 returns paths like
  `galleries/<id>/thumb.webp` **without** a leading slash — never blind-concatenate a host.
- **Image hosts** allowlisted as any `*.nhentai.net` (incl. `static.nhentai.net` for
  avatars). The Rust-side check is `is_allowlisted_image_host`; the CSP `img-src` in
  `tauri.conf.json` must match it. Change one → change the other.
- **Blacklist** is global and persistent, applied **server-side** (`-tag:` query
  exclusion) *and* client-side (hide/blur in grids), with a master toggle. It must never
  break the grid layout.
- **Background service** `service.rs` runs a throttled worker queue (downloads, image
  prefetch, cache maintenance, account sync, periodic Popular refresh), surfaced through
  `service_*` commands and `service://job` / `service://refresh` events.
- **Single instance** via `tauri-plugin-single-instance`; a second launch focuses the
  existing `main` window.
- **Packaging & uninstaller** Tauri native packaging generates native NSIS (`.exe`) and WiX MSI (`.msi`) installers on Windows (DMG on macOS, deb/AppImage on Linux), with clean uninstaller support registered in system uninstallation mechanisms, alongside portable zip packages. PAF is dropped in favor of native Tauri packaging.
- **Mobile support (Android)** Native Android mobile support via Tauri 2's mobile toolchain (`tauri android`). Targets APK sideloading. Because the maintainer lacks a physical Android test device, Android builds are currently untested. iOS is not supported and has been dropped.
- **i18n** drop-in packs with `en` default; system-locale fallback; community contributions; completeness is
  gated by `npm run i18n:check`.
- **Context management** DCP (`@tarquinen/opencode-dcp`) is **agent tooling, not a product
  feature**. Never let it into the app. Config in `.opencode/dcp.jsonc`.
