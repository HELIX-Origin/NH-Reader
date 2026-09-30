# Feature spec

```markdown
# <Feature name>

**Status:** draft | agreed | in progress | shipped | dropped
**Rule:** `.agents/rules/<trigger>.md`
**Skills:** `.agents/skills/implement-feature.md`

## Problem

What users cannot do today. Concrete, not aspirational.

## Proposal

What to build, in one paragraph.

## Behaviour

- **Does:** observable outcomes, as statements a test could check
- **Does not:** the boundaries, so scope creep is visible
- **Edge cases:** empty, offline, huge, malformed, concurrent

## Surfaces

- `src/lib/...` —
- `src-tauri/src/...` —

## Acceptance

Checkable, and each one runnable:

- [ ]
- [ ]

## Verification

| Check | Command | Result |
| --- | --- | --- |
| frontend | `npm run check` | |
| rust | `cargo check` | |
| i18n | `npm run i18n:check` | |

## Risks

- Upstream API etiquette: does this add request volume?
- Security: new host, new secret, new persisted data?
- Decision log: does this contradict `AGENTS.md` §7?

## Out of scope

What this deliberately does not do. Write it down now, argue later.
```

## Rules

- "Edge cases" is not optional. Empty and offline are where desktop clients die.
- If it contradicts a settled decision, raise it before building, not after.
