# NH Reader v0.7.3

**Release date:** 2026-10-01

## ✨ Highlights

NH Reader v0.7.3 removes automated package builds and release-asset publishing. This project will not distribute unsigned binaries. Build and sign packages locally with your platform's tools and signing credentials; this source release contains no prebuilt application assets.

The release also adds local signing commands for macOS, Linux, Android, and iOS, and corrects project documentation to reflect restored iOS support.

## 🚀 Key Improvements & Features

- **Manual signed distribution** — Local builds and signatures are now the only supported path for creating distributable packages.
- **Platform signing commands** — `package.json` provides `sign:windows`, `sign:macos`, `sign:linux`, `sign:android`, and `sign:ios`.
- **Accurate iOS support information** — Documentation now describes the existing Tauri iOS build path, which requires macOS, Xcode, and Apple signing credentials.

## ✅ Changed

- Bumped project version to `0.7.3` across `package.json`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.lock`.
- Removed `.github/workflows/package.yml`; no CI workflow builds or publishes package assets.
- Updated release and user documentation with manual build/signing instructions and the no-unsigned-assets policy.

## 🐛 Fixed

- **Outdated iOS support documentation** — Removed statements that iOS was unsupported and documented the current Tauri iOS build requirements.

## 🛠️ Manual Build & Signing

There are no prebuilt release assets. Build on the target platform and sign using credentials you control:

- **Windows:** `npm run build:app`, then `npm run sign:windows`. Place your PFX at `certificates/nh-reader-codesign.pfx`; the script can generate a local self-signed certificate if none exists, but self-signed certificates are not trusted publisher identities.
- **macOS:** `npm run build:app`, then `npm run sign:macos -- "<Developer ID Application identity>" "src-tauri/target/release/bundle/macos/NH Reader.app"`. Notarization is a separate Apple distribution step.
- **Linux:** `npm run build:app`, then `npm run sign:linux -- path/to/package`; verify with `gpg --verify path/to/package.asc path/to/package`.
- **Android:** `npm run mobile:android:init`, `npm run mobile:android:build`, then `npm run sign:android -- path/to/release.keystore --ks-key-alias <alias> path/to/app.apk`.
- **iOS:** On macOS with Xcode and a valid Apple signing identity/provisioning profile, run `npm run mobile:ios:init`, then `npm run sign:ios -- CODE_SIGN_STYLE=Manual DEVELOPMENT_TEAM=<team-id> CODE_SIGN_IDENTITY="Apple Distribution" PROVISIONING_PROFILE_SPECIFIER=<profile-name>`.

Do not commit private keys, keystores, certificates, or provisioning profiles.

## Verification

- Build and test checks were not run at the maintainer's request because this release changes release metadata, documentation, and distribution workflow only; no application logic was changed.

## 📄 Changes & Commits

- Release source: annotated tag `v0.7.3` (source only; no application assets)

Full commit history: `git log --oneline v0.7.2..v0.7.3`
