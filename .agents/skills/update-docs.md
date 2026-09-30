# Skill: update-docs

**Use when:** a doc or ledger is out of date. Usually called *inside* a change, not after
it — see `.agents/rules/doc-truthfulness.md`.

## Steps

1. **Identify the drift.** What is the doc claiming that is no longer true?
2. **Find every place that repeats it.** A behaviour change usually lands in two or three
   places: the changelog, a wiki page, a README section, a rule file. Search, do not
   guess.
3. **Fix the drift in the same change as the code.** Docs updated "afterwards" are how
   ledgers rot.
4. **Respect the hierarchy.** `AGENTS.md` wins over a rule file, a rule file wins over
   `CONTRIBUTING.md`, a root doc wins over the wiki. When two disagree, the higher one is
   corrected downward.
5. **Cross-check every factual claim:**
   - every command named exists in `package.json` scripts
   - every file path linked exists
   - every feature described as shipped appears in `CHANGELOG.md`
   - every version matches `package.json` and `tauri.conf.json`
6. **Ledger rules:**
   - behaviour changed → `CHANGELOG.md` entry under the current version
   - task finished → close its `TODO.md` row
   - bug found or fixed → add or remove the `BUGS.md` row
   - decision changed → `AGENTS.md` §7 *and* the originating rule
7. **Run `npm run check:agents`** — it validates the ecosystem's internal links and shape.

## Never

- Never document an aspiration as a shipped feature.
- Never leave a link to a file that does not exist.
- Never rewrite a whole doc to fix one stale line.
- Never add a "will fix" debt to a ledger to make it look tidy.
