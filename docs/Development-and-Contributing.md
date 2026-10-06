---

> **[Documentation](README.md)** / **Development & Contributing**
>
> 🧭 **Navigation:** [Getting Started](Getting-Started.md) · [Installation](Installation-and-Maintenance.md) · [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Settings](Settings-and-API-Key.md) · [Architecture](Architecture.md) · [All Docs](README.md)

---

# Development & Contributing

How to build, test, and contribute to NH Reader.

## 🏗️ Project layout

```
AGENTS.md        agent/setup entry point + locked-in decisions
ROADMAP.md       product direction & milestones
PLAN.md          active sprint plan
TODO.md          actionable task ledger
BUGS.md          known issues
wiki/            GitHub wiki source (copy to .wiki.git to publish)
src/             SvelteKit static SPA
src-tauri/       Rust backend (Tauri 2)
  src/nh_desktop.rs (API client), commands.rs (Tauri commands),
      service.rs (background queue), image_cache.rs (disk cache),
      db.rs (SQLite)
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
| Dev app | `npm run dev:app` (Tauri dev; Vite serves on the fixed port **14440**) |
| Frontend type/lint | `npm run check` |
| Frontend build | `npm run build` |
| i18n completeness | `npm run i18n:check` |
| Rust check | `cargo check` (in `src-tauri/`) |
| Rust tests | `cargo test` (in `src-tauri/`) |
| App release bundle | `npm run build:app` |
| App debug bundle | `npm run build:app:debug` |
| Android init | `npm run mobile:android:init` |
| Android build APK | `npm run mobile:android:build` |
| iOS init | `npm run mobile:ios:init` |
| iOS build archive | `npm run mobile:ios:build` |

**Always** run `npm run check` for frontend changes and `cargo check` (+ `cargo test` when
relevant) for Rust changes before calling a task done. For translation contributions, run `npm run i18n:check`.

## ⚠️ Working rules

- Product identity is **NH Reader** (the folder name is a misnomer, not the product
  name; see `.agents/rules/identity.md`).
- Respect nhentai.net: throttle, no scraping, no hammering — it's a public API, be polite.
- No panics across the command boundary (return `Result<_, String>`).
- Keep tracking docs honest: update `TODO.md`/`ROADMAP.md`/`PLAN.md`/`BUGS.md` in the same change.
- Follow `.agents/` rules before submitting code.

## 🤝 How to contribute

1. Open an issue for discussion (bug or feature).
2. Branch, implement, and verify (checks above).
3. Open a PR to `main` referencing the issue.
4. Link the PR/commit in `TODO.md` when a task lands.

To contribute translations, see [Contributing Translations](https://github.com/HELIX-Origin/NH-Reader/blob/main/CONTRIBUTING.md#contributing-translations) and [Localization](Localization.md). Language packs are 100% drop-in JSON files.

### 📚 Adding a documentation page

The `docs/` folder is published as the GitHub Pages site from the repository's Pages settings. To add a page:

1. Create `docs/<Page-Name>.md`; the Pages layout supplies the language selector, so no Markdown translation widget is needed.
2. Register it in `docs/_data/navigation.yml`, which drives the site sidebar, previous/next links, and the project page's documentation directory.
3. Link to other pages with relative `.md` paths so the links work both on GitHub and on the Pages site.

Root Markdown files are separate from the Pages documentation. GitHub does not run `docs/translate.js` in Markdown, so no Markdown page embeds a translation control. The Pages site translates its documentation in place without generating language-specific pages.

## 📜 License

BSD 3-Clause — see the repo root [LICENSE.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/LICENSE.md) (or [README.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/README.md)) for details. Note the project policy in
[PRIVACY.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/PRIVACY.md) and
[TOS.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md).

## 🔗 Related

- [ROADMAP.md](https://github.com/HELIX-Origin/NH-Reader/blob/main/ROADMAP.md) · [Backend (Rust)](Backend-Rust.md) ·
  [Frontend (SvelteKit)](Frontend-SvelteKit.md) · [Architecture](Architecture.md)

---

### 📚 Documentation Index
- **Core**: [Home](README.md) · [Getting Started](Getting-Started.md) · [Installation & Maintenance](Installation-and-Maintenance.md)
- **App Features**: [Search & Filters](Search-and-Filters.md) · [Blacklist](Blacklist.md) · [Favorites & History](Favorites-and-History.md) · [Reader & Galleries](Reader-and-Galleries.md) · [Settings & API Key](Settings-and-API-Key.md) · [Localization](Localization.md)
- **Architecture & Development**: [Architecture](Architecture.md) · [Backend (Rust)](Backend-Rust.md) · [Frontend (SvelteKit)](Frontend-SvelteKit.md) · [Packaging & Bundling](Installer-Engine.md) · [Development & Contributing](Development-and-Contributing.md)
- **Reference**: [Security](Security.md) · [Privacy](Privacy.md) · [Troubleshooting](Troubleshooting.md) · [FAQ](FAQ.md)

---

*[NH Reader](https://github.com/HELIX-Origin/NH-Reader) — a lightweight, modern, cross-platform client for nhentai.net.*

*[Documentation Home](README.md) · [Repository](https://github.com/HELIX-Origin/NH-Reader) · [Releases](https://github.com/HELIX-Origin/NH-Reader/releases) · [Security](Security.md) · [Privacy](Privacy.md) · [TOS](https://github.com/HELIX-Origin/NH-Reader/blob/main/TOS.md) · [License](https://github.com/HELIX-Origin/NH-Reader/blob/main/LICENSE.md)*
