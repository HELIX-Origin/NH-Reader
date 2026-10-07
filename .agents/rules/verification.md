# Rule: Verification

**Status:** MANDATORY — always in force
**Triggers:** before saying any task is done, fixed, or working
**Enforced by:** `npm run check:agents`

## Must

Run checks only when the change affects application code or executable application configuration. Do not run build, test, lint, localization, or agent-ecosystem checks for documentation-only, release-note-only, metadata-only, or workflow-only changes. If a change mixes app code and documentation, run checks required by the app-code portion.

| Change touched | Run |
| --- | --- |
| `src/**`, `.svelte`, `.css` | `npm run check` |
| `src-tauri/**`, `.rs` | `cargo check` and `cargo test` in `src-tauri/` |
| `src/lib/i18n/**` or new user-visible strings | `npm run check:i18n` |
| `.agents/**`, `AGENTS.md`, `.opencode/**` | `npm run check:agents` only when application code is also changed or the user explicitly requests this check |
| Documentation, changelog, release notes, version metadata, or workflow-only changes | No build or test checks |

## Never

- Never report completion from a plausible reading of the code. "Should compile" is not
  verification.
- Never report a failure as a success. If a check is red, say so and name the output.
- Never run build or test checks solely for documentation, release-note, version-metadata, or workflow-only changes.
- Never let a check failure be silently absorbed — surface it to the user.
- **Never push to remote until all relevant checks have been run in this session and
  passed. Changes with no applicable checks (documentation, release notes, version
  metadata, or workflow-only changes) may be pushed without running builds or tests.
  If an applicable check cannot be run (missing toolchain, offline, etc.), stop and report.
- Run CI workflow dry-runs only when the workflow changes application build or deployment
  behavior and a dry-run is available. Removal-only or documentation-only workflow changes
  do not require a dry-run.

## Reporting

State which commands ran and their result when checks were applicable. If checks were
skipped because only documentation, release metadata, or workflow configuration changed,
say that explicitly instead of implying they passed.
