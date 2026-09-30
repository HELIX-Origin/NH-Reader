# Commit messages

[Conventional Commits](https://www.conventionalcommits.org/). One line, imperative mood,
no trailing period, ≤ 72 characters of subject.

```
<type>(<scope>): <subject>

<optional body — why, not what>

<optional footer — BREAKING CHANGE:, Closes #123>
```

## Types

| Type | Use for | Emoji |
| --- | --- | --- |
| `feat` | new user-visible capability | ✨ |
| `fix` | bug fix | 🐛 |
| `perf` | performance work | ⚡ |
| `refactor` | no behaviour change | ♻️ |
| `style` | formatting only | 🎨 |
| `docs` | documentation, wiki, `.agents/` | 📝 |
| `test` | tests | 🧪 |
| `build` | deps, build, packaging | 📦 |
| `ci` | automation | 👷 |
| `chore` | everything else | 🔧 |

## Scopes

`api` · `ui` · `components` · `stores` · `i18n` · `design` · `rust` · `db` · `service` ·
`image-cache` · `installer` · `security` · `deps` · `docs` · `agents` · `release`

## Examples

```
feat(ui): add gallery pager with keyboard navigation
fix(image): join API v2 relative paths without a leading slash
fix(db): return Result instead of panicking on a corrupt cache
perf(service): throttle periodic popular refresh to one job per hour
docs(agents): rebuild the agent ecosystem with a mechanical gate
chore(release): bump version to 0.3.1
```

## Never

- Never past tense in the subject ("added" → "add").
- Never a vague subject ("fixes", "update", "changes").
- Never more than one logical change per commit.
- Never a bare `git commit` with no `-m` — this shell has no editor.
