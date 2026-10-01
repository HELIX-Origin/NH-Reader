# Rule: Release

**Status:** CONDITIONAL
**Triggers:** version bumps, tagging, cutting a release, publishing notes
**Enforced by:** review + `npm run check:agents`

## Must

- **Versions move together.** `package.json` and `src-tauri/tauri.conf.json` /
  `Cargo.toml` must agree. A bump that touches one and not the other is incomplete.
- **A release is:** bump version → `CHANGELOG.md` for that version → `release-notes.md`
  rewritten for humans → seed release announcement in GitHub Discussions
  (`.github/discussions/announcements/v<version>.md` and `.github/discussions/announcements.md`) →
  verify the build → tag annotated. In that order.
- **Tag format:** `v<major>.<minor>.<patch>`, annotated (`git tag -a -m`), pointing at
  the release commit.
- **Pre-releases for non-app updates:** Updates that do not affect the application binaries (such as documentation, CI workflow refactoring, developer tooling, or website updates) can be published as pre-releases using SemVer pre-release tags targeting the next minor version (`v<major>.<next_minor>.0-<identifier>`, e.g., `v0.8.0-docs.1`, `v0.8.0-ci.1`). Pre-releases do **not** touch `package.json`, `Cargo.toml`, or `tauri.conf.json` since they do not affect the application itself; app manifests remain at the latest official release version. Targeting the next minor version ensures the pre-release is chronologically and semantically ordered ahead of the latest official release (`v0.8.0-* > v0.7.x`) rather than sorting behind it. Pre-release tags containing hyphens (`v*-*`) are automatically ignored by `.github/workflows/package.yml` on push, ensuring that no multi-platform packaging runner jobs are spawned for non-app updates.
- **Release notes** come from the changelog, but are written for a person deciding whether
  to upgrade. Lead with what changed for them, not with commit subjects.
- **Seed release discussions:** Every release must have a detailed, comprehensive release
  announcement discussion seeded in `.github/discussions/announcements/v<version>.md` and indexed
  in `.github/discussions/announcements.md` explaining the release and its features.
- **Two separate release documents — never confuse Release Notes and Release Announcements:**
  - **Release Notes** (`release-notes.md`, via `.agents/templates/release-notes.md`): Concise technical summary attached to GitHub Releases and the repo root. Contains version metadata, brief highlights, change/fix lists, installer filenames, verification outputs, and commit hashes.
  - **Release Announcements** (`.github/discussions/announcements/v<version>.md`, via `.agents/templates/release-announcement.md`): Long-form, community-facing editorial discussions. Contains engaging headline (`# 📢 NH Reader v<version> — <Theme>`), narrative overview, deep thematic feature walkthroughs with emoji headers, comprehensive package table, and links to documentation guides.
- **Verify before tagging:** `npm run check`, `cargo check`, `cargo test`,
  `npm run i18n:check`, `npm run check:agents`, `npm run tauri build`.
- **No release without explicit user request.** Preparing files is fine; tagging,
  pushing, and publishing are not.

## Never

- Never confuse Release Announcements with Release Notes — they serve different audiences and use separate formats.
- Never tag a commit that has not had the build verified.
- Never amend or move a published tag.
- Never bump a version as a side effect of ordinary feature work.
- Never put a real key, token, or personal path in release notes.

## Order of operations

Work down from `ROADMAP.md` for scope, `CHANGELOG.md` for content,
`.agents/skills/cut-release.md` for the procedure,
`.agents/templates/release-notes.md` for the release notes shape, and
`.agents/templates/release-announcement.md` for the discussion announcement format.
