# Skill: fix-bug

**Use when:** something is broken or wrong.

## Steps

1. **Reproduce it first.** If you cannot reproduce, say so — you do not yet have a bug, you
   have a guess. Report the guess and stop.
2. **Find the real cause**, not the nearest symptom. Trace it to the specific line or
   config. A fix that patches the symptom will come back.
3. **Check the decision log** (`AGENTS.md` §7). A surprising bug is often a settled
   decision being violated — image URL joining, CSP vs allowlist, blacklist applied on one
   side only.
4. **Write the failing case down in `BUGS.md`** if it is user-visible and not already
   listed. The row is the acceptance criterion.
5. **Fix it at the cause.** Smallest change that removes the cause.
6. **Cover it.** `cargo test` for Rust; for frontend logic, the check that exercises the
   path. A fix with no test or no verification is a hope.
7. **Run the checks** from `AGENTS.md` §4. Read the output.
8. **Close the loop:** remove the `BUGS.md` row (or mark it fixed with the commit ref) in
   the same change. Add a `CHANGELOG.md` entry if behaviour changed for the user.

## Never

- Never fix a symptom you have not traced to a cause.
- Never bundle an unrelated cleanup with a bug fix. Separate changes, separate reasoning.
- Never disable a check to get green.
- Never declare it fixed without having reproduced before and verified after.
