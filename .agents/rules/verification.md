# Rule: Verification

**Status:** MANDATORY — always in force
**Triggers:** before saying any task is done, fixed, or working
**Enforced by:** `npm run check:agents`

## Must

Run the checks that match what you touched, in this session, and read the output.

| Change touched | Run |
| --- | --- |
| `src/**`, `.svelte`, `.css` | `npm run check` |
| `src-tauri/**`, `.rs` | `cargo check` and `cargo test` in `src-tauri/` |
| `src/lib/i18n/**` or new user-visible strings | `npm run i18n:check` |
| `.agents/**`, `AGENTS.md`, `.opencode/**` | `npm run check:agents` |
| Anything at all | `npm run check:agents` |

`npm run check:agents` is cheap. Run it even on changes that touch nothing it inspects.

## Never

- Never report completion from a plausible reading of the code. "Should compile" is not
  verification.
- Never report a failure as a success. If a check is red, say so and name the output.
- Never skip a check because the change looks trivial.
- Never let a check failure be silently absorbed — surface it to the user.

## Reporting

State which commands ran and their result. If something could not be run (missing tool,
offline, no TTY), say that explicitly instead of implying it passed.
