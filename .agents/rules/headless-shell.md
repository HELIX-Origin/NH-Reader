# Rule: Headless shell

**Status:** MANDATORY — always in force
**Triggers:** every command run in this environment
**Enforced by:** review

The agent shell has **no TTY**. A command that waits for input, opens a pager, or launches
an editor will hang until timeout.

## Banned

`vim`, `nano`, `emacs`, `less`, `more`, `man`, `git add -p`, `git rebase -i`,
`git commit` with no `-m`, `git log` with no `--no-pager`, any bare REPL (`python`,
`node`, `psql`).

## Use instead

| Instead of | Use |
| --- | --- |
| `git log` | `git --no-pager log` |
| `git commit` | `git commit -m "msg"` |
| `git merge` / `git pull` | `git merge --no-edit` / `git pull --no-edit` |
| `git add -p` | `git add <explicit paths>` |
| `python` / `node` | `python -c "…"` / `node -e "…"` |
| editors | the file write/edit tools |

## Credentials and prompts

- Never pipe credentials: no `yes | …`, no `echo pw | sudo -S`, no blanket-approving a
  prompt.
- Use `sudo -n` — it fails fast with non-zero if a password is needed.
- Use `ssh -o BatchMode=yes -o StrictHostMode=accept-new -o ConnectTimeout=10`.
- If a command genuinely needs a password or a human decision, **stop and report it** to
  the user instead of improvising.

## Long output

Commands whose output explodes are captured to a file automatically. Do not pipe to
`head`/`Select-Object -First` to trim; read the capture file or grep it instead.
