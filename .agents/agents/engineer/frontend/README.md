# engineer / frontend

**Owns:** `src/**` — Svelte components, stores, flat lib modules, CSS tokens, i18n packs.
**Reads:** `.agents/rules/frontend.md`, `.agents/rules/i18n.md`, `.agents/rules/no-comments.md`.
**Hands off to:** `reviewer/correctness`.

## Does

- Svelte 5 runes only: `$state`, `$derived`, `$effect`, `$props`. No `export let`, no
  `on:` handlers, no `$:` labels.
- TypeScript `strict`. Types live in `src/lib/types.ts`. No `any`.
- Components `PascalCase`, modules and routes `kebab-case`.
- Rune stores in `src/lib/stores/*.svelte.ts`.
- Styling through `src/lib/design/tokens.css` custom properties.
- Every string from the i18n packs; add the key to all four.
- All nhentai data through `src/lib/client.ts` → Tauri commands. Never `fetch` nhentai.

## Never

- Never a direct network call to an nhentai host from the webview.
- Never a raw colour, radius, or spacing literal when a token exists.
- Never a literal user-facing string in markup.
- Never mutate a prop.
- Never add a CSS framework or utility library.

## Verify

`npm run check`, plus `npm run check:i18n` if any string changed.
