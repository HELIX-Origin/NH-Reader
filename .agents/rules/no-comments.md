# Rule: No comments in code

**Status:** MANDATORY — always in force
**Triggers:** any edit under `src/**` or `src-tauri/src/**`
**Enforced by:** `npm run check:agents`

## Must

Write self-documenting code. No explanatory comments, no commented-out code, no
"section" banners, no narration of what the next line does.

## The only permitted comments

1. The file license header.
2. Tooling markers that are load-bearing for the compiler or linter, e.g.
   `// @ts-expect-error <reason>`.
3. Doc comments on **exported public API** — `///` in Rust on `pub` items, `/** */` in
   TypeScript on `export`ed items. Describe the contract, not the implementation.

## Never

- A comment that restates the code: `// increment counter` above `counter += 1`.
- A comment explaining a refactor or a fix ("was X before").
- A comment marking a region: `// ---- utils ----`.
- Commented-out code left "for reference".

## Why

Comments rot. The decision log in `AGENTS.md` and the wiki exist for rationale that
outlives a line of code. Rationale that must live next to code goes in a doc comment on
the exported symbol.
