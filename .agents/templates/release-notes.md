# Release notes

The human-facing version of the changelog, for someone deciding whether to upgrade.
Written for a person, not a log parser. See `.agents/skills/cut-release.md`.

```markdown
# NH Desktop 0.4.0

<One or two sentences: what this release is, in plain language.>

## Highlights

- **<Big change>** — one or two sentences on what a user gets.
- **<Big change>** —

## New

- Feature — what it does, in one line.

## Improved

- Change — what is better, from the user's side.

## Fixed

- Bug — what was wrong and what happens now.

## Breaking

- Anything a user must change, or data that must be migrated. Omit if there is none.

## Upgrade

- Download the installer and run it over your existing install. Your library, settings, and
  history carry over.
```

## Rules

- Lead with what a user would notice. Not with commit subjects.
- No internal file paths, no refactor chatter, no emoji in headings.
- No secrets, tokens, or personal paths.
- If nothing is breaking, omit the section rather than writing "None".
- "Your data carries over" is a claim — only write it if it is true this release.
