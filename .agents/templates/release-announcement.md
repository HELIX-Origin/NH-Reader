# Release Announcement Template

The canonical format for GitHub Discussions release announcements for NH Reader.
Written to announce new releases in GitHub Discussions under the Announcements category.
Seeded in `.github/discussions/announcements/v<version>.md` and indexed in
`.github/discussions/announcements.md`. See `.agents/skills/cut-release.md`.

> [!IMPORTANT]
> **Do not confuse with Release Notes.** Release Announcements are long-form, community-focused
> discussion threads seeded under `.github/discussions/announcements/v<version>.md`. Release notes
> for GitHub Releases use a distinct, concise technical format defined in `.agents/templates/release-notes.md`.

```markdown
# 📢 NH Reader v<version> — <Key Theme / Major Highlights Headline>

**Release Date:** YYYY-MM-DD  
**Tag:** [`v<version>`](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v<version>)

<High-level announcement paragraph: what this release is, why it matters, key themes, and what users get in plain language.>

---

## 🌟 What's New in v<version>

### <Emoji> <Feature Category / Area>
- **<Feature name>** — <Detailed explanation of what the feature does, how it works, and how users interact with it>.
- **<Improvement name>** — <Detailed explanation of the behavioral or UX enhancement and its benefits>.

### <Emoji> <Feature Category / Area>
- **<Feature name>** — <Detailed explanation of what the feature does, how it works, and how users interact with it>.
- **<Improvement name>** — <Detailed explanation of the behavioral or UX enhancement and its benefits>.

---

## 🛠️ Manual Build & Signing

There are no prebuilt release assets. Build on each target platform and sign locally with your own certificate or key before distributing:

- **Windows:** `npm run build:app`, then `npm run sign:windows`. Place your PFX at `certificates/nh-reader-codesign.pfx`; the script can generate a local self-signed certificate if none exists, but self-signed certificates are not trusted publisher identities.
- **macOS:** `npm run build:app`, then `npm run sign:macos -- "<Developer ID Application identity>" "src-tauri/target/release/bundle/macos/NH Reader.app"`.
- **Linux:** `npm run build:app`, then `npm run sign:linux -- path/to/package`; verify with `gpg --verify path/to/package.asc path/to/package`.
- **Android:** `npm run mobile:android:init`, `npm run mobile:android:build`, then `npm run sign:android -- path/to/release.keystore --ks-key-alias <alias> path/to/app.apk`.
- **iOS:** From macOS with Xcode and a valid Apple signing identity/provisioning profile, run `npm run mobile:ios:init`, then `npm run sign:ios -- CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM=<team-id> CODE_SIGN_IDENTITY="Apple Distribution" PROVISIONING_PROFILE_SPECIFIER=<profile-name>`.

Signing credentials and provisioning profiles are user-managed and must not be committed. The project does not publish release assets.

---

## 📖 Documentation & Community

- [NH Reader Documentation](../../docs/README.md)
- [Getting Started Guide](../../docs/Getting-Started.md)
- [Search & Filtering Guide](../../docs/Search-and-Filters.md)
- [GitHub Discussions Community](https://github.com/HELIX-Origin/NH-Reader/discussions)
- [Issue Tracker & Bug Reports](https://github.com/HELIX-Origin/NH-Reader/issues)

Thank you to everyone in our community for testing, providing feedback, and contributing!
```

## Rules

- Always follow this exact structure and section headings.
- Announcements are seeded under `.github/discussions/announcements/v<version>.md` and linked in `.github/discussions/announcements.md`.
- Lead with an engaging title, release date, tag link, and user-centric summary.
- Organize features by thematic categories with clear subheadings and emoji badges.
- Detail *why* features matter and how to use them, not just commit diffs.
- Include the local build and signing command for every supported platform.
- Never claim that prebuilt release assets are available.
- Always include links to the user documentation in `docs/`.
- No personal local paths, secrets, or unverified claims.
