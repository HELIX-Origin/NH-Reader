# Skill: onboard

**Use when:** first task in this repo, or you have lost the plot mid-session.

## Steps

1. Read `AGENTS.md` §1 and §2. It is already in context — that is the point of it. Skim
   §7, the decision log, so you do not relitigate a settled choice.
2. `git status` and `git --no-pager log --oneline -10`. See what is in flight and what just
   landed.
3. Read `ROADMAP.md` for direction, then `TODO.md` for the actionable queue, then
   `BUGS.md` for what currently hurts.
4. Get the real shape of the code, not the one in the docs:
   - `src/lib/` — flat modules, `components/`, `stores/`, `i18n/`, `design/`
   - `src-tauri/src/` — `nh_desktop.rs` (API), `commands.rs` (Tauri surface), `error.rs`,
     `db.rs`, `service.rs`, `image_cache.rs`
5. Read **one** real file end to end for the area you are about to touch, and match its
   style. That is faster and more reliable than any summary.

## Learn the traps

These are the ones that actually cost time:

- The folder is `lewd-clips-app`, a misnomer — it is not the product name. The product is
  **NH Reader**; identifiers are `nh-reader`. See `.agents/rules/identity.md`.
- API v2 image paths have **no leading slash**. `joinUrl` in `src/lib/image.ts` exists for
  a reason.
- The webview never fetches nhentai. All traffic is Rust.
- No comments in code. The codebase has very few on purpose.
- The shell has no TTY. See `.agents/rules/headless-shell.md`.

## Then

Load the skill for your actual task: `implement-feature.md`, `fix-bug.md`, or
`review-change.md`.
