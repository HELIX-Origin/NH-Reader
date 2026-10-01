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

## 📦 Distribution & Available Packages

Download the package for your platform from the [GitHub Release](https://github.com/HELIX-Origin/NH-Reader/releases/tag/v<version>):

- **Windows:** NSIS Installer (`NH Reader_<version>_x64-setup.exe`), WiX MSI (`NH Reader_<version>_x64_en-US.msi`), and Portable ZIP (`NHReaderPortable_<version>.zip`).
- **Linux:** Debian package (`nh-reader_<version>_amd64.deb`), AppImage (`nh-reader_<version>_amd64.AppImage`), and Portable Tarball (`nh-reader_portable_<version>_linux_x86_64.tar.gz`).
- **macOS:** DMG Disk Image (`NH Reader_<version>_x64.dmg`), App Bundle (`NH Reader_<version>_x64.app`), and Portable ZIP (`NHReaderPortable_<version>_macOS.zip`).
- **Android:** Sideload APK (`nh-reader_<version>_universal.apk`) *(community-supported / untested)*.

Upgrade in place: run the new installer over your existing installation. Your local database (`database.sqlite`), favorites, reading history, downloaded archives, and settings carry over automatically.

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
- List all supported platforms and installer variants under Distribution & Available Packages.
- Always include links to the user documentation in `docs/`.
- No personal local paths, secrets, or unverified claims.
