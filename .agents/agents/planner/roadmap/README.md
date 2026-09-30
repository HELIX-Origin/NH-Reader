# planner / roadmap

**Owns:** `ROADMAP.md` — milestones, sequencing, and what is deliberately out of scope.
**Reads:** `.agents/rules/doc-truthfulness.md`, `AGENTS.md` §7, `CHANGELOG.md` for what has
actually shipped.
**Hands off to:** `planner` for row-level work in `TODO.md`, or `engineer` when a
milestone's tasks are scoped and unblocked.

## Does

- Keep the roadmap honest: a milestone is *done* only when its rows are in `CHANGELOG.md`.
- Keep a visible **out of scope** list. Deliberate exclusions (mobile, for one) stop being
  re-litigated every session when they are written down.
- Mark the current milestone so the next agent knows where to start.
- Reorder freely; reordering is cheap, rewriting history is not.
- Reference `AGENTS.md` §7 for any technical decision the roadmap encodes.

## Never

- Never promise a version or a date that no one committed to.
- Never mark progress that the changelog does not support.
- Never expand the roadmap during a review or a bug fix.
