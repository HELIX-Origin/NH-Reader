# 🐛 BUGS

> [!IMPORTANT]
> All known bugs are listed here. Keep in mind, that if a bug is missing, it may not have been discovered or reported yet.
>
> The repository maintainers (and contributors) actively search for new bugs and update this document accordingly. In some cases, a bug will be spotted and fixed without this page being immediately updated. This page is primarily a living index and may not always reflect the most current state of the codebase.
>
> AI agents are strongly advised to update this page first and push it to the remote before working on any new bug fixes or features. This way the remote repository always has the most up-to-date list of known issues.

## 📖 Legend

### 🚦 Status

- ⚠️ **open** — reproducible, needs fixing *(Detailed lists with possible fixes encouraged. Attempt to include steps to reproduce, expected behavior, and actual behavior. An estimate of how long it might take to fix is also helpful.)*
- 🚧 **investigating** — repro/root-cause in progress *(List of issues currently being worked on. Used for tracking active work. must reference an existing bug from the open section.)*
- 🚫 **wontfix** — accepted limitations *(features that can't be fixed at this time without significant changes or trade-offs)*
- ✅ **resolved** — verified and fixed *(moved to closed with the corresponding release version or commit)*

### 🚨 Severity

- 🔴 **Critical**: *Bugs that cause crashes or major functionality loss.*
- 🟠 **High**: *Bugs that significantly impact usability but do not crash the app.*
- 🟡 **Medium**: *Bugs that affect certain features or have minor usability issues.*
- 🟢 **Low**: *Minor bugs or visual glitches that do not significantly impact the user experience.*

## 🚫 Known quirks & external limitations (wontfix bucket)

- 🐢 **Rate limiting / 429s:** nhentai throttles rapid API access. The Rust client throttles
  requests; UI must back off and not spam-retry.
- **Image CDN 404s:** some legacy galleries return 404s on `t.nhentai.net`/`i.nhentai.net`
  despite valid metadata (CDN re-encoding, `webp` shifts). Proxy fallback (cache-backed
  `proxy_image`) + graceful placeholder required.
- **Single-instance is app-wide:** running the app again focuses the existing window — by
  design.
- **Search semantics are the site's:** query syntax is nhentai's (`-`, `,`, `:`, ranges).
  Our UI builds it, but edge semantics (e.g. OR-within-type) are inherited, not invented.
- **Upload-date "popular" ordering:** the site exposes no stable *popularity* sort in search;
  only recency. Surfaces limited accordingly. *(This is not necessarily a won't fix. But until we can create our own way of determining popularity, this limitation remains.)*
- **Trusted release signing is unavailable:** No trusted organization code-signing identity is available for automated release builds. The packaging workflow has been removed; the project does not publish prebuilt or unsigned release assets. Local self-signed Windows certificates do not establish publisher trust.

## 💡 Explicitly not bugs

- 💡 Galleries that legitimately contain blacklisted tags are still accessible from detail/reader
  (blacklist governs discovery lists, not direct links) — by design.

## ⚠️ Open

*No open bugs currently reported.*

## ✅ Closed

### 2026-10-02 — Blacklist page filling & dynamic scaling stream buffer

- **Severity**: 🟠 High (Usability / Discovery)
- **Status**: ✅ resolved (fixed in v0.7.4)
- **Root Cause**: When blacklisting tags, languages, artists, or categories with the blacklist mode set to "Hide", `GalleryGrid` filtered items client-side from fixed-size server page batches (28 items). When many items matched the blacklist, pages rendered partially empty or with only 1 or 0 items instead of maintaining a full grid.
- **Fix**:
  1. Implemented client-side stream buffering and pagination backfilling in `src/lib/api.ts` (`streamBackfilledList`). When `blacklistMode === 'hide'`, it continuously pulls upstream pages until accumulating enough non-blacklisted galleries to deliver a full page of 28 unblocked items.
  2. Maintained surplus unblocked items in memory for seamless forward and backward navigation with zero empty slots.
  3. Added reactive `blacklistVersion` state tracking in `src/lib/stores/blacklist.svelte.ts` and `src/routes/+page.svelte` to invalidate and re-stream full unblocked pages whenever blacklist tags or modes are updated.

### 2026-10-02 — NSIS installer finish page text legibility & previous version uninstall failure

- **Severity**: 🟠 High (Installer & Usability)
- **Status**: ✅ resolved (fixed in v0.7.4)
- **Root Cause**:
  1. Setting `MUI_BGCOLOR "18181B"` darkened the dialog background, but the finish page title and body text controls retained Windows default black text (`COLOR_WINDOWTEXT`), rendering dark text on a dark background.
  2. In NSIS, running the previous uninstaller without `_?=$INSTDIR` caused it to copy itself to `%TEMP%`, spawn asynchronously, and immediately exit, allowing the new installer to write files while the uninstaller was still deleting them.
- **Fix**:
  1. Added `SetFinishPageColors` with `MUI_FINISHPAGE_CUSTOMFUNCTION_SHOW` and `MUI_WELCOMEPAGE_CUSTOMFUNCTION_SHOW` in `src-tauri/windows/hooks.nsh` to explicitly color title (1201), body (1202), and checkboxes (1203/1204) with light `#FFFFFF` and `#F4F4F5` on transparent background.
  2. Implemented `NSIS_HOOK_PREINSTALL` to terminate any lingering app process and invoke `"$INSTDIR\uninstall.exe" /S _?=$INSTDIR` synchronously with `ExecWait`, ensuring previous files are completely purged before the new version installs.

### 2026-10-02 — NSIS Korean language MultiUser string missing fallback warnings

- **Severity**: 🟢 Low (Build Warning)
- **Status**: ✅ resolved (fixed in v0.7.4)
- **Root Cause**: Standard NSIS `Korean.nsh` lacked the `MULTIUSER_INSTALLMODEPAGE` language string definitions, producing build warnings for `MULTIUSER_TEXT_INSTALLMODE_TITLE` and related strings during `npm run build:app`.
- **Fix**: Added full Korean translations for `MULTIUSER_INSTALLMODEPAGE` strings into `src-tauri/windows/hooks.nsh` and the local NSIS Korean language file.

### 2026-10-02 — GitHub Pages deployment workflow authenticated with PAT_TOKEN

- **Severity**: 🟡 Medium (Deployment)
- **Status**: ✅ resolved (fixed in v0.7.4)
- **Root Cause**: The deployment workflow used default repository tokens which lacked permissions to configure and deploy Pages across branches.
- **Fix**: Configured `.github/workflows/pages.yml` with `secrets.PAT_TOKEN`, using standard `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` (`path: docs`), and `actions/deploy-pages@v4`.

### 2026-10-01 — Release workflow failed to publish desktop installers (.exe, .msi, .deb, .AppImage, .dmg)

- **Severity**: 🟠 High (Packaging & Distribution)
- **Status**: ✅ resolved (Unreleased)
- **Root Cause**: `actions/upload-artifact@v4` preserved subdirectories (`nsis/`, `msi/`, `deb/`, `appimage/`, `dmg/`) when uploading artifacts from `src-tauri/target/release/bundle/`. When `actions/download-artifact@v4` merged all artifacts into `release-artifacts`, the installers remained inside nested subdirectories. The `action-gh-release@v2` job used `files: release-artifacts/*` which only matched top-level files (`.zip`, `.apk`, `.tar.gz`) and ignored directories.
- **Fix**: Added a flattening step in `publish-release`, `publish-test-prerelease`, and `dry-run-summary` (`find release-artifacts -mindepth 2 -type f -exec mv {} release-artifacts/ \;`) before publishing, ensuring all platform installers sit directly in `release-artifacts/` and are attached to GitHub releases.

### 2026-10-01 — Root-file translation links led to unpublished Pages paths

- **Severity**: 🟡 Medium (Documentation usability)
- **Status**: ✅ resolved (Unreleased)
- **Root Cause & Fix**: The root Markdown menus linked to `/repo/*.html` copies that the docs-folder Pages source does not publish. Removed the broken root menus and unnecessary generated copies. The documentation site continues to translate in place with `docs/translate.js`.

### 2026-10-01 — Markdown translate "dropdown" rendered as a flat list of language names

- **Severity**: 🟡 Medium (Documentation usability)
- **Status**: ✅ resolved (Unreleased)
- **Root Cause**: Every Markdown page embedded a `<select>` with inline styles, an `onchange` handler and a `<script src="./docs/translate.js">`. GitHub's Markdown sanitizer strips `<select>`, `<label>`, `<script>`, `style` and event handlers, so only the bare option text survived and no script ever ran.
- **Fix**:
  1. Removed the widget from all GitHub-rendered Markdown files; Github does not execute the translation script there.
  2. The GitHub Pages layout and project page render a real `<select>` (`docs/_includes/translate-control.html`, languages from `docs/_data/languages.yml`). `docs/translate.js` honours `?lang=` and translates the page in place through the Google Translate element without leaving the page.

### 2026-10-01 — NSIS installer dark mode text illegibility, placeholder branding & missing macOS/Linux portable packages (Resolved in v0.6.1)

- **Severity**: 🟠 High (Usability / Packaging)
- **Status**: ✅ resolved (fixed in v0.6.1)
- **Root Cause & Fix**:
  1. Multi-platform portable packages added to `.github/workflows/package.yml` across Windows (`NHReaderPortable_Windows_x64.zip`), Linux (`nh-reader_portable_linux_x86_64.tar.gz`), and macOS (`NHReaderPortable_macOS.zip`).
  2. Regenerated `src-tauri/windows/header.bmp` and `src-tauri/windows/sidebar.bmp` from official app icon `src-tauri/icons/icon.png` with exact sampled `#0d0d0d` background.
  3. Cleaned conflicting `MUI_BGCOLOR` and `MUI_TEXTCOLOR` defines in `src-tauri/windows/hooks.nsh` that caused unreadable white-on-white / white-on-gray text, while retaining DWM dark titlebar decorations.

---

## ✅ Fixed

- **Window Close Interception & Chrome_WidgetWin_0 Error 1411 (Fixed in Track 8)**: Resolved issue where clicking the native window title bar close ("X") button intercepted close with `api.prevent_close()` and hid the window without exiting, creating a zombie background process that required forced SIGINT (`0xc000013a`) and caused WebView2 class unregister Error 1411. Removed premature Win32 `window.destroy()` calls and allowed `CloseRequested` to cleanly trigger `app.exit(0)`, enabling graceful shutdown of WebView2 and Tauri.
- **Excessive Storage & Cache Problem (Fixed in Track 3)** ([#7](https://github.com/HELIX-Origin/NH-Reader/issues/7)): Implemented configurable cache storage budgets (500 MB to Unlimited), automatic background LRU cache pruning in `image_cache.rs` and `service.rs`, physical database compaction via SQLite `VACUUM`, and isolated cache clearance that protects user favorites and blacklist data.
- **Installed App Resource Packaging & Blank Screen on Launch (Fixed in v0.5.0)** ([#4](https://github.com/HELIX-Origin/NH-Reader/issues/4)): Reverted from the custom installer to Tauri's native packaging (NSIS with per-user/per-machine scope and WiX MSI on Windows, DMG on macOS, deb/AppImage on Linux). Ensured all assets, frontend resources, and dependencies are bundled directly into the installer, resolving the blank launch window.
- **Installation Options (Fixed in v0.5.0)**: Added installation destination scopes during setup (Install for current user, Install for all users, Custom install directory with native folder browser dialog) via native NSIS and WiX packaging.
- **Dedicated uninstall executable missing (Fixed in v0.4.0)**: Implemented dedicated uninstaller executable (`uninstall.exe` on Windows, `uninstall` on Linux) that copies to temp on invocation to avoid locking files in the installation directory, allowing complete directory deletion.
- **Uninstaller file locking on Windows (Fixed in v0.4.0)**: Executable lock prevented `remove_dir_all` from removing program files. Resolved via dedicated `uninstall.exe` executing from temp.
- **Mutex poison unwrap panic in db.rs (Fixed in v0.4.0)**: Replaced 9 `.unwrap()` calls with `lock_conn()` poison recovery.
- **Favorites button state reflection (Fixed in v0.4.0)**: Fixed the favorite button so it immediately toggles and updates its reactive state between "Favorite" and "Saved", accurately reflecting the current gallery favorite status.
- **Gallery download pipeline failure (Fixed in v0.4.0)**: Fixed background downloads by fetching and archiving pages directly into clean `.zip` and `.cbz` packages without requiring an external API key.
