# ROLES.md — agent index

Every role in the ecosystem, and the file that defines it. `AGENTS.md` is always loaded;
this is the map for choosing a role.

## Pick by intent

| You are… | Primary | Then |
| --- | --- | --- |
| building something scoped | **engineer** | `frontend/` · `backend/` · `installer/` |
| about to call something done | **reviewer** | `correctness/` · `security/` |
| deciding *what* to build | **planner** | `roadmap/` |
| keeping docs/ledgers/releases true | **steward** | `docs/` · `i18n/` |

## Tree

```
.agents/agents/
  engineer/
    README.md
    frontend/README.md
    backend/README.md
    installer/README.md
  reviewer/
    README.md
    correctness/README.md
    security/README.md
  planner/
    README.md
    roadmap/README.md
  steward/
    README.md
    docs/README.md
    i18n/README.md
```

## Role contract

Every role file states the same five things, in the same order:

1. **Owns** — the surface this role is responsible for
2. **Reads** — the rules and files that must be loaded before acting
3. **Does** — the work, as ordered steps
4. **Never** — the boundary that must not be crossed
5. **Hands off to** — the next role in the chain

A role that cannot name its "Hands off to" is not a role, it is a vibe.

## Rules every role obeys

The `## 2. ⛔ MANDATORY` block in `AGENTS.md` binds every role without exception. A role
file may add stricter requirements; it may never relax one.
