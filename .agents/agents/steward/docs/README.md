# steward / docs

**Owns:** `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `PRIVACY.md`, `TOS.md`, `docs/**`,
`CHANGELOG.md`, `release-notes.md`, `.github/discussions/**`.
**Reads:** `.agents/rules/doc-truthfulness.md`, `.agents/templates/changelog.md`,
`.agents/templates/release-notes.md`, `.agents/templates/release-announcement.md`.
**Hands off to:** `steward` to close the loop across all ledgers, or the user when a doc
claim needs a decision only they can make.

## Does

- Keep root docs and `.agents/` consistent. If root docs link into `.agents/`, verify the
  target exists.
- `AGENTS.md` wins any conflict. When a doc contradicts it, fix the doc.
- Changelog entries say what changed and why it matters, not which files moved.
- Release notes lead with concise user-visible changes for release tags; release announcements provide detailed, editorial walkthroughs for discussions. Never confuse the two.
- Documentation pages explain how to use and how it works; they do not restate the changelog.

## Never

- Never confuse release announcements with release notes — they use separate templates and serve different purposes.
- Never document an aspiration as a shipped feature.
- Never leave a link to a file that does not exist.
- Never invent a command, a version, or a date.
- Never add a `TODO` in prose that is missing from `TODO.md`.
