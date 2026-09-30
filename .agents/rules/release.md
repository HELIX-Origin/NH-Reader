# Rule: Release

**Status:** CONDITIONAL
**Triggers:** version bumps, tagging, cutting a release, publishing notes
**Enforced by:** review + `npm run check:agents`

## Must

- **Versions move together.** `package.json` and `src-tauri/tauri.conf.json` /
  `Cargo.toml` must agree. A bump that touches one and not the other is incomplete.
- **A release is:** bump version → `CHANGELOG.md` for that version → `release-notes.md`
  rewritten for humans → tag annotated → verify the build. In that order.
- **Tag format:** `v<major>.<minor>.<patch>`, annotated (`git tag -a -m`), pointing at
  the release commit.
- **Release notes** come from the changelog, but are written for a person deciding whether
  to upgrade. Lead with what changed for them, not with commit subjects.
- **Verify before tagging:** `npm run check`, `cargo check`, `cargo test`,
  `npm run i18n:check`, `npm run check:agents`, `npm run tauri build`.
- **No release without explicit user request.** Preparing files is fine; tagging,
  pushing, and publishing are not.

## Never

- Never tag a commit that has not had the build verified.
- Never amend or move a published tag.
- Never bump a version as a side effect of ordinary feature work.
- Never put a real key, token, or personal path in release notes.

## Order of operations

Work down from `ROADMAP.md` for scope, `CHANGELOG.md` for content,
`.agents/skills/cut-release.md` for the procedure, and
`.agents/templates/release-notes.md` for the output shape.
