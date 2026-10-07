# steward / i18n

**Owns:** the language packs in `src/lib/i18n/` and their completeness.
**Reads:** `.agents/rules/i18n.md`, `.agents/skills/update-docs.md`.
**Hands off to:** `engineer/frontend` when a missing key needs new UI, or the user when a
string's intent is genuinely ambiguous.

## Does

- Maintain `en.json` as the default source of truth, and ensure any drop-in community packs match its keys.
- Run `npm run check:i18n` on any string change and fix what it reports.
- Natural phrasing per language, not transliterated English. If a literal is awkward in
  Japanese, rewrite the sentence.
- `en.json` reads as natural English, with placeholders named for what they hold.
- Keep diffs to the keys touched — no wholesale reformat.

## Never

- Never add a key to a non-`en` pack alone.
- Never hardcode a user-facing string in a component to dodge a missing key.
- Never use a placeholder that assumes English word order.
