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
  design. The installer/maintenance mode builds its own Tauri app and is intentionally outside
  the single-instance plugin.
- **Search semantics are the site's:** query syntax is nhentai's (`-`, `,`, `:`, ranges).
  Our UI builds it, but edge semantics (e.g. OR-within-type) are inherited, not invented.
- **Upload-date "popular" ordering:** the site exposes no stable *popularity* sort in search;
  only recency. Surfaces limited accordingly. *(This is not necessarily a won't fix. But until we can create our own way of determining popularity, this limitation remains.)*

## 🧠 Explicitly not bugs

- 💡 Galleries that legitimately contain blacklisted tags are still accessible from detail/reader
  (blacklist governs discovery lists, not direct links) — by design.

## 🚨 Open

- **Installed App Resource Packaging & Blank Screen on Launch (Breaking)** ([#4](https://github.com/HELIX-Origin/nhentai-desktop/issues/4)): Running the application from its installed directory does not load any interface content (blank window), whereas running in development mode (`npm run dev:tauri`) functions properly. The installer currently only places `NH Desktop.exe` and `uninstall.exe` into the installation folder, omitting app resources from the build phase. Additionally, production mode exhibits CSP restrictions and window routing issues that prevent SvelteKit from bootstrapping in production.
  - *Steps to reproduce*: Run `npm run build:installer`, install to either user or system location, and launch `NH Desktop.exe` from the installation directory.
  - *Expected behavior*: The installed application should launch with all necessary bundled resources and display the full UI without requiring a dev server.
  - *Potential investigation & fixes*: A possible starting point (not a guaranteed fix) is investigating the restoration of default Tauri NSIS and MSI packaging to determine if the custom installer breakage was triggered by the aggressive removal of standard packaging. Additionally investigate production CSP configuration in `tauri.conf.json`, verifying that all built resources/assets are properly packaged and deployed into the install location, and confirming SPA client route resolution in release builds. As a guaranteed last-ditch fallback if fixing the custom installer requires a complete rewrite, the project can drop the custom installer entirely and revert to Tauri's native packaging (NSIS and MSI on Windows).
- **Storage Problem**: The app is eating up a massive amount of storage. Potential Fixes include: 
  - Optimize the data cache so only the necessary files are retained and old or redundant data is purged regularly.
  - Introduce a method to store the cache into compressed archives to save space.
  - Introduce a background cleanup task to periodically purge old or redundant cache files.
  - Introduce a method for compressing the app's internal files via a suitable compression algorithm to save space. *(The app would need to be able to read from compressed files transparently. This would preferably be compressed resource packs that save space without degrading performance.)*
- **UI Polish and Touch Up**: The app's user interface should be audited for any inconsistencies and areas that could benefit from visual refinement. Potential Fixes include:
  - Standardize spacing, margins, and padding across all screens.
  - Ensure consistent font sizes, colors, and styles throughout the app.
  - Improve the responsiveness of UI elements to different screen sizes and orientations.
  - Address any visual glitches or misalignments observed during usage.
- **Theme Engine**: The app currently lacks a comprehensive theme engine, limiting customization options for users. Potential Fixes include:
  - Implement a theme engine that allows users to switch between light, dark, and custom themes.
  - Ensure that all UI components respond correctly to theme changes.
  - Provide an option to save and load custom themes.
  - Create multiple themes to have packaged into the app. We want modern themes with a unique visual identity for each. The themes should cover a range of aesthetics and provide a visually appealing experience for users. Each theme should have both light and dark modes that can be set via our theme toggle *(Light | Dark | System)*. Here are two themes I would like to include, but we should add more:
    - **Compact**: A theme designed for efficiency and minimal screen real estate usage, with a focus on compact layouts and streamlined visuals.
    - **Glassmorphism**: A theme featuring translucent elements, frosted glass effects, and a modern, layered aesthetic.
    - **Acrylic**: A theme featuring semi-transparent elements, layered visuals, and a modern aesthetic, inspired by the Acrylic design language.
    - **Liquid Glass**: A theme featuring translucent elements, frosted glass effects, and a modern, layered aesthetic. Inspired by the Liquid Glass effects in macOS 26.
- **Navigation Buttons (Close | Minimize | Maximize)**: The macOS traffic light design we use is actually more due to the fact that the default ones on Windows and Linux are severely outdated and visually unappealing. We need to adjust them to incorporate the style of whatever theme is applied.
- **Title Bar Menu Backgrounds**: When creating the theme engine, we need to ensure that the title bar menus have a consistent background that matches the overall theme and provides a visually appealing experience. A transparent background in the menus makes them illegible and detracts from the user experience.

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
| 🚨 | Theme Engine does not apply correctly to all UI components |
| ⚠️ | Navigation Buttons do not match the applied theme |
| ⚠️ | Title Bar Menu Backgrounds are inconsistent with the theme |
| ⚠️ | Navigation buttons need to be redesigned |
| 🟡 | Some UI elements have minor visual inconsistencies |
| 🟢 | Minor text alignment issues in certain UI components |

---

## ✅ Fixed

- **Installation Options (Fixed in v0.5.0)**: Added installation destination scopes during setup (Install for current user, Install for all users, Custom install directory with native folder browser dialog) dynamically tailored across Windows, Linux, and macOS, alongside an optional portable mode toggle and PortableApps PAF installer packaging.
- **Dedicated uninstall executable missing (Fixed in v0.4.0)**: Implemented dedicated uninstaller executable (`uninstall.exe` on Windows, `uninstall` on Linux) that copies to temp on invocation to avoid locking files in the installation directory, allowing complete directory deletion.
- **Uninstaller file locking on Windows (Fixed in v0.4.0)**: Executable lock prevented `remove_dir_all` from removing program files. Resolved via dedicated `uninstall.exe` executing from temp.
- **Mutex poison unwrap panic in db.rs (Fixed in v0.4.0)**: Replaced 9 `.unwrap()` calls with `lock_conn()` poison recovery.
- **Favorites button state reflection (Fixed in v0.4.0)**: Fixed the favorite button so it immediately toggles and updates its reactive state between "Favorite" and "Saved", accurately reflecting the current gallery favorite status.
- **Gallery download pipeline failure (Fixed in v0.4.0)**: Fixed background downloads by fetching and archiving pages directly into clean `.zip` and `.cbz` packages without requiring an external API key.