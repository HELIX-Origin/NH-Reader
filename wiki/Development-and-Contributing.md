# Development & Contributing

How to build, test, and contribute to NH Desktop.

## 🏗️ Project layout

```
AGENTS.md        agent/setup entry point + locked-in decisions
ROADMAP.md       product direction & milestones
TODO.md          actionable task ledger
BUGS.md          known issues
wiki/            GitHub wiki source (copy to .wiki.git to publish)
src/             SvelteKit static SPA
src-tauri/       Rust backend (Tauri 2)
  src/nh_desktop.rs (API client), commands.rs (44 commands),
      service.rs (background queue), image_cache.rs (disk cache),
      db.rs (SQLite), installer.rs, platform/{mod,windows,macos,linux}.rs
scripts/         build-installer.mjs
```

The `.agents/` ecosystem holds rules, agent roles, and workflows used alongside AI-assisted
development. Start at `AGENTS.md` — it is the entry point for agents and humans alike —
then `.agents/ROLES.md`. `npm run check:agents` mechanically gates it.

## 📋 Prerequisites

- Node.js (npm) — frontend toolchain.
- Rust (stable) + Tauri 2 prerequisites per platform
  ([tauri docs](https://v2.tauri.app/start/prerequisites/)).

## ⚙️ Build & run

| Task | Command |
| --- | --- |
| Install deps | `npm install` |
| Dev app | `npm run dev:tauri` (Tauri dev; Vite serves on the fixed port **14440**) |
| Frontend type/lint | `npm run check` |
| Frontend build | `npm run build` |
| i18n completeness | `npm run i18n:check` |
| Rust check | `cargo check` (in `src-tauri/`) |
| Rust tests | `cargo test` (in `src-tauri/`) |
| Installer binary | `npm run build:installer` |

**Always** run `npm run check` for frontend changes and `cargo check` (+ `cargo test` when
relevant) for Rust changes before calling a task done. For translation contributions, run `npm run i18n:check`.

## ⚠️ Working rules

- Product identity is **NH Desktop** (the folder name is a misnomer, not the product
  name; see `.agents/rules/identity.md`).
- Respect nhentai.net: throttle, no scraping, no hammering — it's a public API, be polite.
- No panics across the command boundary (return `Result<_, String>`).
- Keep tracking docs honest: update `TODO.md`/`ROADMAP.md`/`BUGS.md` in the same change.
- Follow `.agents/` rules before submitting code.

## 🤝 How to contribute

1. Open an issue for discussion (bug or feature).
2. Branch, implement, and verify (checks above).
3. Open a PR to `main` referencing the issue.
4. Link the PR/commit in `TODO.md` when a task lands.

To contribute translations, see [Contributing Translations](https://github.com/HELIX-Origin/nhentai-desktop/blob/main/CONTRIBUTING.md#contributing-translations) and [Localization](Localization). Language packs are 100% drop-in JSON files.

## 📜 License

BSD 3-Clause — see the repo root [LICENSE.md](https://github.com/HELIX-Origin/nhentai-desktop/blob/main/LICENSE.md) (or [README.md](https://github.com/HELIX-Origin/nhentai-desktop/blob/main/README.md)) for details. Note the project policy in
[PRIVACY.md](https://github.com/HELIX-Origin/nhentai-desktop/blob/main/PRIVACY.md) and
[TOS.md](https://github.com/HELIX-Origin/nhentai-desktop/blob/main/TOS.md).

## 🔗 Related

- [Roadmap](Roadmap) · [Backend (Rust)](Backend-Rust) ·
  [Frontend (SvelteKit)](Frontend-SvelteKit) · [Architecture](Architecture)