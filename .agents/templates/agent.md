# New agent role

Use this when adding a primary or sub role to `.agents/agents/`. Register it in
`.agents/ROLES.md` in the same change, and wire the routing row in `AGENTS.md` §3 if it
gets a trigger.

## Location

- Primary: `.agents/agents/<primary>/README.md`
- Sub: `.agents/agents/<primary>/<sub>/README.md`

## Template

```markdown
# <primary> / <sub>

**Owns:** the surface, named specifically.
**Reads:** the rules and files to load before acting.
**Hands off to:** the next role, and when.

## Does

1. Ordered steps.

## Never

- Hard boundaries.

## Sub-roles

| Surface | Role | Rule |
| --- | --- | --- |
```

## The contract

Every role file states the same five things in the same order: **Owns**, **Reads**, **Does**,
**Never**, **Hands off to**. A role that cannot name where it hands off is not a role.

- **Owns** names files or a subsystem, not a feeling.
- **Reads** lists actual paths, each with the trigger that makes it necessary.
- **Does** is ordered and checkable.
- **Never** is the boundary. Include the things an eager agent would plausibly do.
- **Hands off to** names a role and a condition.

## Checks before you call it done

- [ ] File exists at the right path, named `README.md`.
- [ ] Registered in `.agents/ROLES.md` — tree listing and pick-by-intent table.
- [ ] Routing row in `AGENTS.md` §3, if it has a trigger.
- [ ] Every path it references in `Reads` exists.
- [ ] Does not duplicate a rule's content. Roles point at rules; rules hold the content.
- [ ] Does not relax anything in `AGENTS.md` §2. A role may be stricter, never laxer.
- [ ] `npm run check:agents` passes.

## Never

- Never create a role that only restates a rule. Rules and roles are different things.
- Never let two roles own the same surface.
- Never skip `ROLES.md` — an unregistered role is invisible.
