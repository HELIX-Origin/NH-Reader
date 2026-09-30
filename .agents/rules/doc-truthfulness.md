# Rule: Documentation truthfulness

**Status:** MANDATORY
**Triggers:** editing `TODO.md`, `BUGS.md`, `CHANGELOG.md`, `README.md`, `wiki/**`,
`ROADMAP.md`, or changing behaviour
**Enforced by:** review

A stale ledger is a bug, not a cosmetic issue. These files are how the next agent decides
what to do.

## Must

- **Behaviour change → `CHANGELOG.md` entry**, in the same change. Under the current
  version heading, in the appropriate section.
- **Task completed → its `TODO.md` row is updated in the same change.** Not "I'll do it
  after". Not left done-but-open.
- **Bug found or fixed → `BUGS.md` gains or loses the row.** A bug fixed in code but
  still listed as open is a lie.
- **Decision reversed or locked → update `## 7. Decision log` in `AGENTS.md`** and the
  rule that came from it, in the same change.
- **Claim a command works only after running it.** Never write "run `npm run foo`" in a
  doc unless the script exists in `package.json`.

## Never

- Never leave a "will do" TODO in the ledger after the work is done.
- Never document an aspiration as a shipped feature. Mark unreleased work as such.
- Never invent a version, a date, a contributor, or a command output.
- Never contradict a rule file from a root doc. `AGENTS.md` wins.

## Wiki

`wiki/` holds user-facing explanation (how to use, how it works). If a page describes
behaviour that changed, fix the page in the same change.
