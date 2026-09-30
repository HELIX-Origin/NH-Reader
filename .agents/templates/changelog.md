# Changelog entry

Added under the current version heading, in the matching section, in the same change as
the code. See `.agents/rules/doc-truthfulness.md`.

```markdown
## [0.4.0] — 2026-01-01

### Added
- **Gallery pager**: keyboard navigation and page memory across sessions.
- **Japanese and Chinese language packs** — selectable in Settings, system-locale default.

### Changed
- **Blacklist filtering** now applies server-side via `-tag:` exclusion, so blacklisted
  results never leave the device.

### Fixed
- **Reader zoom** no longer resets when opening a new gallery.

### Removed
- **Legacy filter dropdown** — replaced by the filter panel.

### Security
- API key is never written to logs or placed in a URL query string.
```

## Rules

- Describe the change and its effect, not the files that moved.
- Bold the leading noun so the line scans.
- No invented versions, dates, or contributors.
- Every "Fixed" entry corresponds to a closed `BUGS.md` row.
- A user-visible behaviour change gets an entry. A pure refactor does not need one.
