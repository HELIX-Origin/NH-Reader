# Skill: implement-feature

**Use when:** building something scoped. Use `fix-bug.md` instead if the trigger is a
defect.

## Steps

1. **Restate the goal in one sentence** and confirm it matches the request. If the task is
   vague, ask one question rather than guessing at scope.
2. **Load only the triggered rules** — `frontend.md` and/or `backend.md`, plus `i18n.md`
   for any new string. Not the whole rule set.
3. **Read before writing.** Open the two or three files this change will live in, plus one
   neighbouring file for convention. Match what is there.
4. **Plan the diff.** Name the files you expect to touch. If the list surprises you, the
   scope is wrong — go back to step 1.
5. **Implement the smallest complete change.** No speculative abstraction, no drive-by
   cleanup. Solve the actual ask.
6. **Follow the conventions in the loaded rules** — naming, runes, `Result`, tokens, i18n.
7. **Run the checks** from `AGENTS.md` §4 for what you touched. Read the output. Fix
   failures.
8. **Update the ledgers in the same change:** `CHANGELOG.md` entry, `TODO.md` row closed if
   this was a tracked task. See `.agents/rules/doc-truthfulness.md`.
9. **Run `npm run check:agents`** — it is fast and it inspects the ecosystem itself.
10. Report what changed, which checks ran, and their results.

## Never

- Never widen scope. Note the adjacent thing you noticed; don't fix it.
- Never add a dependency without saying why, up front.
- Never leave a check unrun.
- Never commit. The user asks for that explicitly.
