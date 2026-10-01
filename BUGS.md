# 🐛 BUGS

> [!IMPORTANT]
> All known bugs are listed here. Keep in mind, that if a bug is missing, it may not have been discovered or reported yet.
> 
> The repository maintainers (and contributors) actively search for new bugs and update this document accordingly. In some cases, a bug will be spotted and fixed without this page being immediately updated. This page is primarily a living index and may not always reflect the most current state of the codebase.
> 
> AI agents are strongly advised to update this page first and push it to the remote before working on any new bug fixes or features. This way the remote repository always has the most up-to-date list of known issues.

## 📖 Status legend

- 🚨 **open** — reproducible, needs fixing *(Detailed lists with possible fixes encouraged. Attempt to include steps to reproduce, expected behavior, and actual behavior. An estimate of how long it might take to fix is also helpful.)*
- 🚧 **investigating** — repro/root-cause in progress *(List of issues currently being worked on. Used for tracking active work. must reference an existing bug from the open section.)*
- ⚠️ **wontfix** — accepted limitations *(features that can't be fixed at this time without significant changes or trade-offs)*

## ⚠️ Known quirks & external limitations (wontfix bucket)

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

## 🧠 Explicitly not bugs

- 💡 Galleries that legitimately contain blacklisted tags are still accessible from detail/reader
  (blacklist governs discovery lists, not direct links) — by design.

## 🚨 Open

- The following errors have been discovered when running `npm run build:app` *(Note: I replaced my hard coded local app data path with the Windows variable to not expose my system path in the error code below)*:
  
  ```powershell
  warning: !warning: LangString "MULTIUSER_TEXT_INSTALLMODE_TITLE" for language Korean is missing, using fallback from "%LOCALAPPDATA%\tauri\NSIS\Contrib\Language files\English.nsh" (macro:LANGFILE_SETSTRING:7)
  warning: !warning: LangString "MULTIUSER_TEXT_INSTALLMODE_SUBTITLE" for language Korean is missing, using fallback from "%LOCALAPPDATA%\tauri\NSIS\Contrib\Language files\English.nsh" (macro:LANGFILE_SETSTRING:7)
  warning: !warning: LangString "MULTIUSER_INNERTEXT_INSTALLMODE_TOP" for language Korean is missing, using fallback from "%LOCALAPPDATA%\tauri\NSIS\Contrib\Language files\English.nsh" (macro:LANGFILE_SETSTRING:7)
  warning: !warning: LangString "MULTIUSER_INNERTEXT_INSTALLMODE_ALLUSERS" for language Korean is missing, using fallback from "%LOCALAPPDATA%\tauri\NSIS\Contrib\Language files\English.nsh" (macro:LANGFILE_SETSTRING:7)
  warning: !warning: LangString "MULTIUSER_INNERTEXT_INSTALLMODE_CURRENTUSER" for language Korean is missing, using fallback from "%LOCALAPPDATA%\tauri\NSIS\Contrib\Language files\English.nsh" (macro:LANGFILE_SETSTRING:7)
  ```

- The installer still displays dark text on a dark background in the final page. 
- The installer fails to to uninstall the previous version when selecting the option to uninstall the previous version before installing the new version. 
- The workflow updates forgot to add the Windows, macOS, and Linux installers to the release asset uploads steps. *(Currently it uploads the android apk files and the per os portable archives)*
- The signing works correctly when done locally *(no untrusted developer warning)*, but last time i tested it from the release installer, i still got the untrusted developer warning. We will need to investigate this further to see if the issue is actually fixed or not *(I'm assuming it's probably due to the private key(s) not being published. If so, adding the private key(s) to our repo secrets should fix this issue.)*.
- The translate dropdown button in the repo md files is displaying as a list of languages instead of an actual dropdown language selector.

***Note***: *Since some of these issues affect the app code, this update will warrant a version bump.*

## ✅ Closed

### 2026-10-01 — NSIS installer dark mode text illegibility, placeholder branding & missing macOS/Linux portable packages (Resolved in v0.6.1)
- **Severity**: ⚠️ High (Usability / Packaging)
- **Status**: ✅ resolved (fixed in v0.6.1)
- **Root Cause & Fix**:
  1. Multi-platform portable packages added to `.github/workflows/package.yml` across Windows (`NHReaderPortable_Windows_x64.zip`), Linux (`nh-reader_portable_linux_x86_64.tar.gz`), and macOS (`NHReaderPortable_macOS.zip`).
  2. Regenerated `src-tauri/windows/header.bmp` and `src-tauri/windows/sidebar.bmp` from official app icon `src-tauri/icons/icon.png` with exact sampled `#0d0d0d` background.
  3. Cleaned conflicting `MUI_BGCOLOR` and `MUI_TEXTCOLOR` defines in `src-tauri/windows/hooks.nsh` that caused unreadable white-on-white / white-on-gray text, while retaining DWM dark titlebar decorations.

## 📝 Filing a bug

Bug title on GitHub: `🐛 <problem summary>`. Body must include:

- Steps to reproduce (reproduce-first)
- Expected vs actual behavior
- Environment (OS, app/CLI version, DM in use)
- ≥1 verifiable diagram or log when applicable

Entry format once filed:

```
## 2026-09-21 — <short title>  (#<issue>)
- [ ] Reproduced
- [ ] Root cause identified
- [ ] Fix in PR (`Closes #<issue>`)

---

## 📖 Severity Legend
- 🚨 Critical: Bugs that cause crashes or major functionality loss.
- ⚠️ High: Bugs that significantly impact usability but do not crash the app.
- 🟡 Medium: Bugs that affect certain features or have minor usability issues.
- 🟢 Low: Minor bugs or visual glitches that do not significantly impact the user experience.


| Severity | Description |
| :---: | :---: |
| 🚨 | The app is eating up a massive amount of storage |
| 🟡 | Some UI elements have minor visual inconsistencies |
| 🟢 | Minor text alignment issues in certain UI components |

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