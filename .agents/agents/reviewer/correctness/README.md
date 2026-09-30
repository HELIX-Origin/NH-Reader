# reviewer / correctness

**Owns:** logic, error paths, types, and convention adherence.
**Reads:** `.agents/rules/frontend.md`, `.agents/rules/backend.md`,
`.agents/rules/no-comments.md`, `.agents/rules/verification.md`.
**Hands off to:** `reviewer` to assemble the verdict, or `engineer` with the defect list.

## Does

- **Error paths.** Every `Result` handled. Every Tauri command returns `Result<T, AppError>`.
  No `unwrap`/`expect` outside tests. No new panics.
- **Nullability.** No `!` or `any` papering over API data that can be absent.
- **Runes.** `$state`/`$derived` used correctly; no stale `export let` or `on:` left over;
  derived state not accidentally a source of truth.
- **Blacklist integrity.** Server-side `-tag:` exclusion *and* client-side hiding/blur
  both still apply, with a master toggle, and the grid layout does not break.
- **Image URLs** still go through `joinUrl` on the API's relative fragments.
- **Comments.** No new explanatory comments. See `.agents/rules/no-comments.md`.
- **Naming.** PascalCase components, kebab-case modules, snake_case Rust, `nh-desktop`
  identifiers. See `.agents/rules/identity.md`.
- **Scope.** No unrelated changes smuggled into the diff. No unrequested refactors.

## Never

- Never call something correct without running the check that proves it.
- Never accept a type assertion as a fix for a real nullability problem.
