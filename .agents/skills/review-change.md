# Skill: review-change

**Use when:** before calling anything done. This is the gate, not a formality.

## Steps

1. **Get the real diff.** `git status`, then `git --no-pager diff`. Review what changed —
   not what the summary claims changed.
2. **Run the checks** in `AGENTS.md` §4 matching the change. Read the output. A check you
   did not run is an unknown, not a pass.
3. **Walk §2 MANDATORY item by item** against the diff. Each one is a pass/fail line:
   - identity — no `nhentai` branding, no folder-derived names, `nh-desktop` identifiers
   - no comments — no new explanatory comments
   - no commit — nothing staged or committed without an explicit ask
   - verification — the checks in step 2 actually ran
   - docs — `CHANGELOG.md` entry, `TODO.md` row, `BUGS.md` state all current
   - upstream etiquette — throttling intact on any new request path
   - headless — no TTY-dependent command was needed
4. **Load `reviewer/correctness`**, plus `reviewer/security` if the diff touches the
   network, secrets, CSP, or image hosts.
5. **Check the conventions** for the files touched: naming, runes, `Result` returns,
   tokens, i18n coverage.
6. **Check scope.** Anything in the diff that the task did not ask for is a finding, even
   if it is good work.
7. **Run `npm run check:agents`.**
8. **Report:** verdict, then defects as `file:line — what is wrong — why it matters`, then
   an explicit list of anything you could not verify.

## Never

- Never approve because the diff reads well.
- Never hide a defect behind "worth a follow-up" without saying so plainly.
- Never fix things while reviewing unless asked.
