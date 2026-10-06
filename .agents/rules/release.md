# Rule: Release

**Status:** CONDITIONAL
**Triggers:** version bumps, tagging, cutting a release, publishing notes
**Enforced by:** review + `npm run check:agents`

## Must

- **Versions move together.** `package.json` and `src-tauri/tauri.conf.json` /
  `Cargo.toml` must agree. A bump that touches one and not the other is incomplete.
- **A release is:** bump version → `CHANGELOG.md` for that version → `scratch/release-notes.md`
  rewritten for humans → seed release announcement in GitHub Discussions
  (`.github/discussions/announcements/v<version>.md` and `.github/discussions/announcements.md`) →
  verify the build → tag annotated. In that order.
- **Tag format:** `v<major>.<minor>.<patch>`, annotated (`git tag -a -m`), pointing at
  the release commit.
- **Manual distribution only:** There is no automated packaging or release-assets workflow. Build packages locally on each target platform, sign them with the platform-specific `package.json` command and user-owned credentials, and do not publish unsigned release assets.
- **Release notes** come from the changelog, but are written for a person deciding whether
  to upgrade. Lead with what changed for them, not with commit subjects.
- **Seed release discussions:** Every release must have a detailed, comprehensive release
  announcement discussion seeded in `.github/discussions/announcements/v<version>.md` and indexed
  in `.github/discussions/announcements.md` explaining the release and its features.
- **Two separate release documents — never confuse Release Notes and Release Announcements:**
  - **Release Notes** (`scratch/release-notes.md`, via `.agents/templates/release-notes.md`): Concise technical summary attached to GitHub Releases. Scratch-only — lives in the gitignored `scratch/` folder so it is never pushed to remote. Contains version metadata, brief highlights, change/fix lists, installer filenames, verification outputs, and commit hashes.
  - **Release Announcements** (`.github/discussions/announcements/v<version>.md`, via `.agents/templates/release-announcement.md`): Long-form, community-facing editorial discussions. Contains engaging headline (`# 📢 NH Reader v<version> — <Theme>`), narrative overview, deep thematic feature walkthroughs with emoji headers, comprehensive package table, and links to documentation guides.
- **Verify before tagging:** Run `npm run check`, `cargo check`, `cargo test`,
  `npm run i18n:check`, and `npm run tauri build` only when the release changes
  application code requiring those checks. Documentation-, version-metadata-, release-note-,
  or workflow-only releases do not require builds or tests; state that verification was
  skipped rather than recording pending checks as failures.
- **No release without explicit user request.** Preparing files is fine; tagging,
  pushing, and publishing are not.

## Never

- Never confuse Release Announcements with Release Notes — they serve different audiences and use separate formats.
- Never tag application code that has not had its applicable build verified.
- Never amend or move a published tag.
- Never bump a version as a side effect of ordinary feature work.
- Never put a real key, token, or personal path in release notes.

## Order of operations

Work down from `ROADMAP.md` for scope, `CHANGELOG.md` for content,
`.agents/skills/cut-release.md` for the procedure,
`.agents/templates/release-notes.md` for the release notes shape, and
`.agents/templates/release-announcement.md` for the discussion announcement format.
