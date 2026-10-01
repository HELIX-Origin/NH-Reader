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
5. **Rewrite `release-notes.md`** from `.agents/templates/release-notes.md` — the human
   version, leading with what a user would notice.
6. **Verify everything:**
   - `npm run check`
   - `npm run i18n:check`
   - `npm run check:agents`
   - `cargo check` and `cargo test` in `src-tauri/`
   - `npm run tauri build`
   Read every output. A red build does not get tagged.
7. **Stage only release files** — never `git add .`. Confirm nothing unrelated rides along.
8. **Commit** with the release message, using `-m` (no editor).
9. **Tag annotated:** `git tag -a v<version> -m "NH Reader v<version>"`.
10. **Stop.** Report the commit and tag. Do not push unless asked.

## Never

- Never tag a build you did not verify.
- Never amend or move a published tag.
- Never bump a version during ordinary feature work.
- Never put a real key, token, or personal path in the notes.
- Never push without being asked in that same conversation.
