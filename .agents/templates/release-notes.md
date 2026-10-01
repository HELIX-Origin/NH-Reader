# Release Notes Template

The canonical human-facing release notes format for NH Reader.
Written for users and release publishing. See `.agents/skills/cut-release.md`.

> [!IMPORTANT]
> **Do not confuse with Release Announcements.** Release Notes are concise, technical summaries
> attached to GitHub Releases and `release-notes.md`. Discussion announcements for GitHub Discussions
> use a distinct, long-form editorial format defined in `.agents/templates/release-announcement.md`.

```markdown
# NH Reader v<version>

**Release date:** YYYY-MM-DD

## ✨ Highlights

<One or two paragraphs: what this release is, key themes, and what users get in plain language.>

## 🚀 Key Improvements & Features

- **<Feature name>** — <Description of feature, user benefits, and how it works>.
- **<Feature name>** — <Description of feature, user benefits, and how it works>.

## ✅ Changed

- Bumped project version to `<version>` across `package.json`, `Cargo.toml`, `tauri.conf.json`, `Cargo.lock`, and documentation.
- <Behavioral, architectural, or documentation change>.

## 🐛 Fixed

- **<Bug summary>** — <What was broken and how it behaves now>.

## 📦 Install & Upgrading

Download the installer or package for your platform from the Assets section below:

- Windows (NSIS Setup): `NH Reader_<version>_x64-setup.exe`
- Windows (WiX MSI): `NH Reader_<version>_x64_en-US.msi`
- Windows (Portable ZIP): `NHReaderPortable_<version>.zip`
- macOS (DMG): `NH Reader_<version>_x64.dmg` (or `aarch64` for Apple Silicon)
- Linux (Debian): `nh-reader_<version>_amd64.deb`
- Linux (AppImage): `nh-reader_<version>_amd64.AppImage`
- Android (APK): `nh-reader_<version>_universal.apk` *(community-supported / untested)*
- iOS (IPA): `nh-reader_<version>.ipa` *(Apple Silicon macOS sideloading & iOS; community-supported / untested)*

Upgrade in place: run the new installer over your existing installation. Your SQLite database (`database.sqlite`), favorites, reading history, downloaded archives, and settings carry over automatically.

## Verification

- `cargo check` + `cargo test` (src-tauri) — passed (<passed>/<total>)
- `npm run check` (svelte-check) — 0 errors, 0 warnings
- `npm run i18n:check` — <keys>/<keys> keys validated
- `npm run check:agents` — <files>/<files> files compliant, 0 violations

## 📄 Changes & Commits

- `<short-sha>` `<commit message>`
- `<short-sha>` `<commit message>`

Full commit history: `git log --oneline v<previous-version>..v<version>`
```

## Rules

- Always follow this exact structure and section headings.
- Lead with what a user would notice.
- List all platforms and installers clearly under Install & Upgrading.
- Include verification test results and git commit references for transparency.
- "Your data carries over" is a claim — only write it if it is true for this release.
- No secrets, tokens, or personal local paths.
