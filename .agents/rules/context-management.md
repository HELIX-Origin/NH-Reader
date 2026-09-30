# Rule: Context management

**Status:** CONDITIONAL
**Triggers:** a DCP `compress` nudge, a long session, or a context window getting full
**Enforced by:** review

DCP (`@tarquinen/opencode-dcp`) is **agent tooling**. It is not a product feature and must
never appear in the app, its dependencies, or its config.

## Must

- On a DCP `compress` nudge, compress the oldest expendable range, and keep it small.
- **One `compress` call must stay under ~7,000 characters of JSON.** The tool truncates
  around 8k and returns invalid JSON. Compress several small ranges rather than one
  large blob.
- Compress command output and file reads before conversation turns — they are the
  cheapest thing to drop and the most expensive to keep.
- `protectUserMessages` is on. Never work around it by restating a user instruction
  differently to make it compressible.

## Never

- Never compress the user instruction that defines the current task.
- Never add a DCP dependency to `package.json` or `src-tauri/Cargo.toml`. DCP config
  lives in `.opencode/dcp.jsonc` only.
- Never disable a DCP strategy to make a session fit.
- Never carry a compressed summary forward as gospel — the source files are the truth;
  re-read them when it matters.
