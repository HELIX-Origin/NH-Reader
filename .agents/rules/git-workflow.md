# Rule: Git workflow

**Status:** MANDATORY — always in force
**Triggers:** any `git` or `gh` invocation; any staging; any commit
**Enforced by:** review

## Must

- Commit, push, tag, and open PRs **only** when the user asked for that exact action in
  this conversation. Editing files is not consent. Finishing a feature is not consent.
- Stage only the files belonging to the requested work. Pre-existing unrelated
  modifications stay unstaged.
- `gh` runs are non-interactive: `gh pr create --body-file <file>`, `gh issue create
  --body-file <file>`. Never a bare `gh` command that opens an editor.
- Commit messages follow Conventional Commits with project scope. See
  `.agents/templates/commit-message.md`.

## Never

- Never `git add .` or `git add -A` — they sweep in unrelated work.
- Never `--force`/`-f` push, never `git commit --amend`, never `git rebase` on shared
  history, unless explicitly asked.
- Never change git config, never skip hooks, never use `-i` interactive flags.
- Never create empty commits.

## Inspect before acting

Before any commit: `git status`, `git diff`, `git --no-pager log --oneline -10`. Stage
the intended files only, and confirm no secrets are among them.
