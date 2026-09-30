# 🌍 Localization & Language Support

NH Desktop speaks your language. The interface defaults to your operating system language, and
you can pick a different one at any time — in the installer or in **Settings**.

> Only the **app interface** is translated. Gallery titles, tags, and artwork come from
> nhentai.net in whatever language they were published in — those are never machine-translated
> by the app, because that would corrupt search and filtering.

---

## 🎯 Choosing a language

**During installation** — the installer has a **Language** dropdown on the *Options* step. The
installer itself is already in your language at this point, so you can read the options before
you choose.

**After installation** — open **Settings → Appearance → Language** and pick from the list. The
change applies immediately; no restart needed.

**Automatic selection** — on first launch, NH Desktop asks the operating system for its locale
(`en-US` → English, `ja-JP` → Japanese, `zh-CN` → Simplified Chinese, and so on). If your
system language has no pack yet, NH Desktop falls back to English until you choose one.

---

## 📦 Language packs

English (`en.json`) is the default hand-rolled language pack provided with the application.
Other languages are provided as drop-in packs contributed by fluent community members.

If a language pack is missing or does not yet have a translation for a specific string, the application automatically falls back to your operating system locale (if available) and then to English.

---

## 🤝 Contributing a translation

Localization files are entirely drop-in. Contributors never have to edit multiple files or code to add a language.

### Adding a new language

1. **Copy the English template:**

   ```bash
   cp src/lib/i18n/en.json src/lib/i18n/<locale>.json
   ```

   Use a standard BCP-47 locale tag (e.g. `ja.json`, `es.json`, `fr.json`, `de.json`, `zh-Hans.json`).

2. **Translate the strings.** Keep every key structure unchanged. You can optionally include a `_meta` object with `"name"` and `"nativeName"` if you want to customize how the language appears in settings.

3. **Run the validator:**

   ```bash
   npm run i18n:check
   ```

   It automatically discovers your new drop-in file and validates that all keys match `en.json`.

4. **Open a pull request with only your JSON file.** That is the entire process.

### Style guidelines

- **Be concise.** These are short interface labels in a dense UI. Prefer the shortest form a
  native speaker would actually use — long sentences shrink the window and look wrong.
- **Keep placeholders intact.** Strings like `~128 MB` or `Enter` may embed literal text.
- **Use the app's own vocabulary.** The installer calls its steps *Welcome / Location / Options /
  Install*; the sidebar calls them *Latest / Popular / Favorites / History / Downloads /
  Blacklist / Settings*. Translate the concept, not word-for-word, and stay consistent within a
  language.
- **Mind the UI language.** `zh-Hans` and `zh-Hant` are genuinely different files. Arabic is
  right-to-left; keep the wording neutral so layout mirrors correctly.
- **Punctuation and spacing** follow the target language's own conventions (full-width
  punctuation in CJK, non-breaking spaces before `:` in French, and so on).

### Free resources for getting it right

If you want to be certain a phrase reads naturally, cross-check against these free sources:

- **DeepL glossary** — <https://www.deepl.com>
- **Wiktionary** for term consistency — <https://www.wiktionary.org>
- **translate-i18n** community terminology databases — <https://github.com/translate-i18n>
- **Microsoft terminology** (many UI terms defined per locale) — <https://www.microsoft.com>
- Your own OS: many desktop apps are already localized into your language. Inconsistent machine
  translation is easy to spot once you have seen how a competent app words the same button.

For the full list of translation keys and their JSON structural schema, see [CONTRIBUTING.md](https://github.com/HELIX-Origin/nhentai-desktop/blob/main/CONTRIBUTING.md#contributing-translations).

---

## 🧱 How localization works under the hood

| File | Role |
| --- | --- |
| `src/lib/i18n/en.json` | **Source of truth.** Every key must exist here first. Includes `_meta` configuration. |
| `src/lib/i18n/<locale>.json` | Drop-in language pack with optional `_meta` header. |
| `src/lib/i18n/index.ts` | Dynamically imports all drop-in `.json` packs via `LocaleCatalog` with system locale fallback. |
| `src/lib/stores/locale.svelte.ts` | Reactive current locale, system detection, persistence. |
| `scripts/check-i18n.mjs` | `npm run i18n:check` validator. |

Lookup is `locale.t('installer.welcomeTitle')` — a dotted key resolved against the active
dictionary. Missing keys silently fall back to English rather than rendering a raw key, so a
partial pack degrades gracefully instead of breaking the UI.

Your choice is stored in the local database (`settings:locale`) and reused by both the installer
and the app, so they always agree.

---

## 🔗 Related

- [Settings & API Key](Settings-and-API-Key)
- [Installation & Maintenance](Installation-and-Maintenance)
- [Development & Contributing](Development-and-Contributing)
