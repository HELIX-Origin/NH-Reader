# Rule: Frontend

**Status:** CONDITIONAL
**Triggers:** editing `src/**`, any `.svelte` file, any `.css` file
**Enforced by:** `npm run check` (types) + review (style)

## Must

- **Svelte 5 runes.** `$state`, `$derived`, `$effect`, `$props`. No legacy
  `export let`, no `on:click` (use `onclick`), no stores where runes suffice.
- **TypeScript `strict`.** No `any`, no non-null `!` on API data, no `@ts-ignore`.
  `@ts-expect-error` only with a stated reason.
- **Naming.** Svelte components and component names are `PascalCase`
  (`GalleryCard.svelte`). TS/JS modules and route files are `kebab-case` — a multi-word
  module is `titlebar-search.ts`, never `titlebarSearch.ts`; see
  `src/routes/installer/+page.svelte` for the route form.
- **Stores** live in `src/lib/stores/*.svelte.ts` and are rune-based.
- **Flat modules** in `src/lib/`: `api.ts`, `client.ts`, `types.ts`, `query.ts`,
  `image.ts`, `format.ts`, `cache.ts`. Do not invent a `utils/` grab-bag or nest deeper
  without a reason.
- **Styling** is plain CSS using the custom properties in
  `src/lib/design/tokens.css`. Never add a CSS framework, a utility-class library, or an
  inline hex/spacing literal that a token already covers.
- **All nhentai data access** goes through the Tauri command wrappers in
  `src/lib/client.ts`. The webview never calls `fetch` against nhentai.net.
- **User-visible strings** come from the i18n packs, not literals in markup. See
  `.agents/rules/i18n.md`.

## Never

- Never `on:` directive syntax, never `export let`, never `$:` reactive labels.
- Never a direct `fetch` to an nhentai host.
- Never a new colour or spacing value outside `tokens.css`.
- Never mutate a prop. Use a callback or bind.
