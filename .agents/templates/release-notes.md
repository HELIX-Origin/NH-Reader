# Release Notes Template

The canonical human-facing release notes format for NH Reader.
Written for users and release publishing. See `.agents/skills/cut-release.md`.

> [!IMPORTANT]
> **Do not confuse with Release Announcements.** Release Notes are concise, technical summaries
> attached to GitHub Releases and `scratch/release-notes.md` (gitignored — never pushed to remote). Discussion announcements for GitHub Discussions
> use a distinct, long-form editorial format defined in `.agents/templates/release-announcement.md`.

````markdown
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

## 🛠️ Manual Build & Signing

There are no prebuilt release assets. Build on each target platform and sign locally with your own certificate or key before distributing. Signing is a separate, opt-in step — nothing is signed during the build.

### Windows

```powershell
npm run tauri:build:release
npm run sign
```

Place your PFX at `certificates/nh-reader-codesign.pfx`; the script can generate a local self-signed certificate if none exists, but self-signed certificates are not trusted publisher identities.

### macOS

```bash
npm run tauri:build:release
npm run sign
```

The identity comes from `--identity` or `APPLE_SIGNING_IDENTITY` (auto-selected when the keychain holds exactly one codesigning identity). Notarization and stapling run automatically when `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD` and `APPLE_TEAM_ID` are set.

### Linux

```bash
npm run tauri:build:release
npm run sign
gpg --verify path/to/package.asc path/to/package
```

### Android

```bash
npm run tauri:android:init
npm run tauri:android:build
npm run sign -- path/to/app.apk
```

The default keystore is `src-tauri/gen/android/release.keystore` (alias `nh-reader`); pass `--ks` and `--ks-alias` for a custom one.

### iOS

From macOS with Xcode and a valid Apple signing identity/provisioning profile:

```bash
npm run tauri:ios:init
npm run sign -- --ios CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM=<team-id> CODE_SIGN_IDENTITY="Apple Distribution" PROVISIONING_PROFILE_SPECIFIER=<profile-name>
```

Signing credentials and provisioning profiles are user-managed and must not be committed. The project does not publish release assets.

## Verification

- `cargo check` + `cargo test` (src-tauri) — passed (<passed>/<total>)
- `npm run check` (svelte-check) — 0 errors, 0 warnings
- `npm run check:i18n` — <keys>/<keys> keys validated
- `npm run check:agents` — <files>/<files> files compliant, 0 violations

## 📄 Changes & Commits

- `<short-sha>` `<commit message>`
- `<short-sha>` `<commit message>`

Full commit history: `git log --oneline v<previous-version>..v<version>`
````

## Rules

- Always follow this exact structure and section headings.
- Lead with what a user would notice.
- Include the local build and signing commands for every supported platform, each under its own platform heading in a fenced code block (`powershell` for Windows, `bash` elsewhere) so the commands are copy-pasteable as-is.
- Never claim that prebuilt release assets are available.
- Include verification test results and git commit references for transparency.
- "Your data carries over" is a claim — only write it if it is true for this release.
- No secrets, tokens, or personal local paths.
