# Pull request

```markdown
## What

One or two sentences. What does this change do?

## Why

The problem it solves, or `Closes #123`.

## How

The approach, in a few lines. Note anything surprising.

## Changes

- `src/lib/...` — what changed and why
- `src-tauri/src/...` — what changed and why

## Verification

Exactly what you ran, and the result of each:

- [ ] `npm run check` — pass / fail / not run
- [ ] `cargo check` — pass / fail / not run
- [ ] `cargo test` — pass / fail / not run
- [ ] `npm run i18n:check` — pass / fail / not run (if strings changed)
- [ ] `npm run check:agents` — pass / fail / not run
- [ ] manual pass — describe, or state why not possible

## Notes for review

- Anything a reviewer should look at hard.
- New dependencies, with the reason.
- Screenshots, for UI changes.
- Anything you could not verify, stated plainly.

Closes #
```

## Rules

- Every checkbox reflects a command you actually ran. "Not run" is an honest answer.
- Never mark a box ticked on the expectation that it passes.
- Keep the body short. The diff is the documentation; this is the orientation.
