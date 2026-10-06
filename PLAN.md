# NH Reader — Active Plan

> 🗺️ **Living Source of Truth**: The sprint plan for the current release cycle and the complete planned-item history of the repo — the execution view of `ROADMAP.md` (direction) and `TODO.md` (task ledger).

> [!IMPORTANT]
> AI agents strictly required to update this page and all related pages **before** working on any new bug fixes or features and push it to the remote first, without exception. Failure to do so may result in working with outdated information and potentially introducing conflicts or redundant work.

---

## 📜 Tracking Rules

- **No Typo Duplication**: When recording user reports, clean and fix all typos to preserve professional quality.
- **Consistent Formatting**: Maintain consistent formatting and style throughout all documentation to ensure readability and professionalism.
- **Clear Sectioning**: Use clear and descriptive headers for each section to improve navigation and readability.
- **Active Items First**: The currently active milestone, sprint, task, or workstream must always be placed at the top of the content sections.
- **Regular Updates**: Ensure that this file is regularly updated to reflect the latest developments and changes in the project.
- **Improve User Directives**: Continuously refine and clarify user directives to ensure they are easily understood and actionable.
- **Full History**: Every planned item from the entire repo history is represented here as a completed sprint, newest first, so this file always shows the whole plan end to end.
- **Tracking Docs Stay True**: Update `ROADMAP.md`, `TODO.md`, `BUGS.md`, and `PLAN.md` first or in lockstep with code changes so a stale ledger counts as a bug.
- **Always Track Everything**: Every new feature request, enhancement, or bug report must be logged in [`BUGS.md`](./BUGS.md), [`TODO.md`](./TODO.md), and [`ROADMAP.md`](./ROADMAP.md) before execution.

---

## 🎯 Active Sprints

_No active sprint — v0.7.4 shipped on 2026-10-06. The next sprint opens when M13 scope work begins (see 🔮 Planned Sprints)._

---

## 🔮 Planned Sprints

> No post-v0.7.4 sprint is committed yet. Candidate items live in the `⬜ Backlog / Future Enhancements` section of [`TODO.md`](./TODO.md) and the `⚠️ Active & Open Bugs` section of [`BUGS.md`](./BUGS.md); **M13** is scoped after v0.7.4 ships per [`ROADMAP.md`](./ROADMAP.md).

---

## ✅ Completed Sprints

### ✅ Sprint 14: v0.7.4 Release Prep (shipped 2026-10-06)

- ✅ `CHANGELOG.md` frozen: `Unreleased` promoted to `## [v0.7.4]` (2026-10-06) with the v0.7.4 fixes.
- ✅ Release notes prepared with manual build & sign commands for every platform (Windows, macOS, Linux, Android, iOS).
- ✅ Release announcement seeded in `.github/discussions/announcements/v0.7.4.md` and indexed in `announcements.md`.
- ✅ Verified: `npm run check` (0 errors), `cargo check` + `cargo test` (7/7), `npm run i18n:check` (17 × 279/279), `npm run check:agents`.
- ✅ Committed `e55086a`, pushed `main` and the annotated `v0.7.4` tag, and published the source-only GitHub release.

### ✅ Sprint 13: Tracking Ledger Realignment (Oct 06, 2026)

- Replaced hardcoded foreign-repo values in the four `root-*-file-template.md` templates with `{{ }}` placeholders and registered them in `scripts/check-agents.mjs` (12 templates tracked by the gate).
- Converted `TODO.md` status markers to `- [ ]` / `- [x]` checkboxes to match the template checklist style.
- Realigned `ROADMAP.md`, `TODO.md`, and `BUGS.md` to their root file templates (header, Tracking Rules, Metadata) and created `PLAN.md`.
- Corrected three stale BUGS.md statuses (`Unreleased` → `v0.7.2`) and filled the empty `CHANGELOG.md` `Unreleased` section with the v0.7.4 fixes.

### ✅ Sprint 12: v0.7.3 — Manual Signed Distribution (2026-10-01)

- Removed the automated packaging workflow; no unsigned release assets are published.
- Removed the WinGet manifests so the project is no longer listed in the WinGet package source.
- Added local signing commands for Windows, macOS, Linux, Android, and iOS in `package.json`.
- Updated release note and announcement templates with manual build/signing instructions.
- Corrected iOS support statements across project and user documentation.
- Bumped versions to `0.7.3` and published the source-only release (`182ec73`, tag `v0.7.3`).

### ✅ Sprint 11: v0.7.2 — Code Signing & Release Pipeline (2026-10-01)

- Flattened release artifacts in `package.yml` so all desktop installers upload alongside portable archives and split APKs.
- Configured repository code-signing secrets (Windows Authenticode, Android keystore) and restored certificate provisioning before signing steps.
- Aligned the GitHub Pages palette with the HELIX Origin design language.
- Bumped to `0.7.2`, finalized `CHANGELOG.md`, prepared release notes, and seeded the `v0.7.2` announcement.
- Suppressed pre-release packaging runs for non-app updates; documented the pre-release versioning convention.
- Upgraded `scripts/sign.ps1` to sign all binaries before archiving the portable zip.

### ✅ Sprint 10: v0.7.1 — Android Build Repair & Release Workflow Fixes

- Diagnosed and fixed the Android build failure (repeated `--target` flags per architecture).
- Migrated `actions/setup-java@v4` → `@v5` in the `package-android` job.
- Added dry-run validation (`dry_run: true`) and `release_tag` workflow input with recovery mode.
- Released `0.7.1` with finalized changelog, release notes, and seeded all GitHub discussions.
- Fixed installer uploads via artifact flattening and aligned the Pages color palette.

### ✅ Sprint 9: v0.7.0 — Multi-Platform Portable, Mobile Toolchain & UI Polish

- Added multi-platform portable archives (Windows/macOS/Linux) with `.portable` marker, isolated `./data/`, and ancestor traversal; universal launcher scripts.
- Coordinated NSIS dark-theme contrast and generated installer bitmaps from the official app icon.
- Restored the full mobile toolchain (Android/iOS scripts, settings, docs) as local-only builds excluded from CI.
- Stabilized the packaging workflow: per-platform artifact isolation, downstream `publish-release` job, Android split ABIs, true dry-run mode, Node.js 26.
- Added per-platform Tauri configs (`tauri.<platform>.conf.json`) and the NSIS multi-language selector.
- Completed all 17 language packs (100% key parity) and per-locale `Intl` date/number formatting.
- Migrated the wiki to in-repo `docs/` with live translation; seeded release announcements v0.1.0–v0.6.0 with a standard template.
- Reader preload distance, image quality selector, quick controls, and CBZ direct export from the reader toolbar.
- Custom framed title bar with per-OS window controls, configurable position, drag regions, and restored system tray minimize-on-close.
- Arabic RTL layout polish (M9.2 RTL phase).

### ✅ Sprint 8: v0.6.0 — Upstream Alignment, Library Hub & Rebuilt Installer (2026-10-01)

- Adopted the official archive download API (`POST /api/v2/galleries/{id}/download`).
- Dedicated dual-mode account login modal (API key / credentials).
- Primary `/library` navigation tab with offline zip/cbz reading and downloaded-favorites isolation.
- Mihon-style floating bottom navigation.
- Cache management: storage budgets, background LRU pruning, SQLite `VACUUM` compaction.
- Dynamic UI scaling with zero empty card gaps.
- Rebuilt native packaging with the custom NSIS hook template (dual scopes, WiX MSI, `sign.ps1`).
- Closed tracking issues #4, #5, #6, #7, #8, #9.

### ✅ Sprint 7: v0.5.0 — Installation Scopes & Portable Mode (2026-09-30)

- Per-user / all-users / custom install scopes with native folder picker.
- Portable mode architecture (`.portable` runtime marker, isolated data directory).
- PortableApps.com PAF packaging.
- SQLite-backed background download queue persistence.

### ✅ Sprint 6: v0.4.0 — Dedicated Uninstaller & DB Recovery (2026-09-30)

- Dedicated `uninstall.exe` registered in Windows uninstallation facilities.
- HELIX Origin publisher attribution across bundle configurations.
- SQLite mutex poison recovery across all DB commands.
- Download file-lock and favorite-toggle bug fixes.

### ✅ Sprint 5: v0.3.0 — Localization Core & Titlebar Search (2026-09-25)

- Localization core infrastructure (locale store, `t()`, system-locale detection, `i18n:check`, English pack).
- Context-aware titlebar search with keyboard shortcut.
- Installer launch optimization (defer launch to finish button).

### ✅ Sprint 4: v0.2.1 — Title Bar Simplification & Maintenance Isolation (2026-09-25)

- Refined title bar styling and controls.
- Process isolation for the maintenance installer with proper main-window destruction.
- Console window suppression during background actions.

### ✅ Sprint 3: v0.2.0 — Search Filters & Multi-Platform Packaging (2026-09-24)

- Comprehensive search filter drawer (text, language, category, per-type tags, page ranges, sort).
- Platform-tagged installer download names across Windows, Linux, macOS.
- Open source licensing (BSD 3-Clause) and citation metadata.

### ✅ Sprint 2: v0.1.1 — Rebranding & Ecosystem Polish (2026-09-23)

- Identifier rebranding to `nh-reader` (`net.nh-reader.client`).
- Multi-platform CI packaging matrix (Windows, Linux, macOS).
- Agent ecosystem standards: standing conventions, rule triggers, verification gates.

### ✅ Sprint 1: v0.1.0 — Foundation (2026-09-22)

- Scaffold & architecture (M1): Tauri 2 + SvelteKit static SPA, Svelte 5 runes, TypeScript strict.
- Throttled Rust API client (`nh_desktop.rs`) with 26 Tauri commands.
- Design system & app shell (dark palette, sidebar navigation, core views).
- Security hardening (CSP allowlisting `*.nhentai.net`, IPC-only network traffic).
- Background service worker queue and disk image cache.

---

## 🛠️ Verification Commands

```bash
npm run check
npm run check:agents
npm run i18n:check
cargo check
cargo test
```

---

## 🔖 Metadata

- **Project**: NH Reader · **version** 0.7.4
- **Agent Ecosystem:** [`AGENTS`](./AGENTS.md) and [`.agents/`](.agents/) are tracked directly in repository git tracking.
- **Last Updated:** Oct, 06 2026 - 02:38 PM
