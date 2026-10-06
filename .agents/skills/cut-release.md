# Skill: cut-release

**Use when:** version bump, changelog freeze, tag. **Requires an explicit user request.**
Preparing files is fine; tagging, pushing, and publishing are not.

## Steps

1. **Confirm the request.** The user asked for a release, with a version. If they said
   "ship it" without a number, ask for the number.
2. **Freeze the scope.** Everything in the changelog for this version is done and verified.
   If something is half-finished, it waits for the next version.
3. **Bump the version in every place, together:**
   - `package.json`
   - `src-tauri/tauri.conf.json`
   - `src-tauri/Cargo.toml` (and `Cargo.lock` via `cargo check`)
   A bump that touches one and not the others is incomplete.
4. **Write the changelog** for the version using `.agents/templates/changelog.md` — what
   changed, and what it means for the user.
5. **Rewrite `scratch/release-notes.md`** from `.agents/templates/release-notes.md` — the concise
   technical release notes attached to the GitHub release tag and repo root. (Do not confuse
   with discussion announcements).
6. **Seed the release announcement discussion:**
   - Author the comprehensive, long-form community announcement in
     `.github/discussions/announcements/v<version>.md` using
     `.agents/templates/release-announcement.md` (separate format from release notes).
   - Update `.github/discussions/announcements.md` with the release overview, feature
     breakdown, and table of contents entry.
7. **Verify changed application code only:**
   - Run `npm run check` for frontend source changes.
   - Run `npm run i18n:check` for locale-pack or user-visible string changes.
   - Run `npm run check:agents` for agent-ecosystem changes only when app code is also changed or this check is explicitly requested.
   - Run `cargo check` and `cargo test` in `src-tauri/` for Rust source changes.
   - Run `npm run tauri build` when application code or executable packaging configuration changes.
   - For documentation-, release-note-, version-metadata-, or workflow-only changes, do not run build/test checks; state that they were intentionally skipped.
   Read every output for checks that apply. A red applicable build does not get tagged.
8. **Stage only release files** — never `git add .`. Confirm nothing unrelated rides along.
9. **Commit** with the release message, using `-m` (no editor).
10. **Tag annotated:** `git tag -a v<version> -m "NH Reader v<version>"`.
11. **Stop.** Report the commit and tag. Do not push unless asked.

## Never

- Never confuse release announcements with release notes — they use separate templates and serve different purposes.
- Never tag a build you did not verify.
- Never amend or move a published tag.
- Never bump a version during ordinary feature work.
- Never put a real key, token, or personal path in the notes.
- Never push without being asked in that same conversation.
