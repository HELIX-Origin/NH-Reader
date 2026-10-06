# Rule: Documentation truthfulness

**Status:** MANDATORY
**Triggers:** editing `TODO.md`, `BUGS.md`, `CHANGELOG.md`, `README.md`, `docs/**`,
`ROADMAP.md`, `PLAN.md`, or changing behaviour
**Enforced by:** review

A stale ledger is a bug, not a cosmetic issue. These files are how the next agent decides
what to do.

## Must

- **Update tracking files first.** Always update `ROADMAP.md`, `TODO.md`, and tracking files
  first or in lockstep before finishing code changes. They are the easiest files to forget, so
  updating them proactively ensures the source-of-truth is always accurate.
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
- Never duplicate repo-level tracking ledgers (e.g. `Roadmap.md`) inside `docs/`.

## Docs vs Tracking

- Repo root holds **tracking ledgers** (`ROADMAP.md`, `TODO.md`, `BUGS.md`, `CHANGELOG.md`, `PLAN.md`).
- `docs/` holds **user & developer documentation** (how to use, architecture, troubleshooting).
  If behaviour changes, update the docs pages to explain the new behavior. Do not put tracking
  or roadmap ledgers in `docs/`.
