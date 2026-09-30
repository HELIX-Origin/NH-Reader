# steward / docs

**Owns:** `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `PRIVACY.md`, `TOS.md`, `wiki/**`,
`CHANGELOG.md`, `release-notes.md`.
**Reads:** `.agents/rules/doc-truthfulness.md`, `.agents/templates/changelog.md`,
`.agents/templates/release-notes.md`.
**Hands off to:** `steward` to close the loop across all ledgers, or the user when a doc
claim needs a decision only they can make.

## Does

- Keep root docs and `.agents/` consistent. If root docs link into `.agents/`, verify the
  target exists.
- `AGENTS.md` wins any conflict. When a doc contradicts it, fix the doc.
- Changelog entries say what changed and why it matters, not which files moved.
- Release notes lead with the user-visible change.
- Wiki pages explain how to use and how it works; they do not restate the changelog.

## Never

- Never document an aspiration as a shipped feature.
- Never leave a link to a file that does not exist.
- Never invent a command, a version, or a date.
- Never add a `TODO` in prose that is missing from `TODO.md`.
