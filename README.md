<div align="center">

# NH Reader

<p align="center">
  <a href="https://github.com/HELIX-Origin/nh-reader/releases"><img src="https://img.shields.io/github/v/release/HELIX-Origin/nh-reader?include_prereleases&label=Release&color=blue" alt="Release" height="20" /></a>
  <a href="https://docs.helix-origin.club/nh-reader/"><img src="https://img.shields.io/badge/Docs-docs.helix--origin.club-brightgreen" alt="Documentation" height="20" /></a>
  <a href="https://wiki.helix-origin.club/nh-reader/"><img src="https://img.shields.io/badge/Wiki-wiki.helix--origin.club-brightgreen" alt="Technical Wiki" height="20" /></a>
  <a href="https://opensource.org/licenses/BSD-3-Clause"><img src="https://img.shields.io/badge/License-BSD--3--Clause-blue.svg" alt="License: BSD-3-Clause" height="20" /></a>
  <a href="https://tauri.app"><img src="https://img.shields.io/badge/Tauri-v2-blue?logo=tauri" alt="Tauri v2" height="20" /></a>
</p>

**A lightweight, modern, cross-platform client for [nhentai.net](https://nhentai.net) — built with Tauri v2 and Svelte 5.**

Native desktop and mobile reader featuring an advanced search & filter engine, persistent multi-tier blacklists, local SQLite caching, archive downloads, and a private local-first architecture.

> **18+ only.** This application is intended for adults only. By using it you confirm that you are of legal age in your jurisdiction to view adult content.

</div>

---

## 📖 Primary Gateways

All comprehensive user guides, API manuals, and technical architecture specifications are centrally hosted:

- 📖 **Documentation**: [docs.helix-origin.club/nh-reader](https://docs.helix-origin.club/nh-reader/) — Getting started, search filters, blacklist management, and reader guides.
- 🧠 **Technical Wiki**: [wiki.helix-origin.club/nh-reader](https://wiki.helix-origin.club/nh-reader/) — Architecture, SQLite schema, background worker service, and API integration.
- 🌐 **Organization Portal**: [www.helix-origin.club](https://www.helix-origin.club/) — HELIX Origin organization hub.

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [Rust](https://www.rust-lang.org/) (1.80+)

### Running Locally
```bash
npm install
npm run tauri dev
```

### Verification & Quality Gate
```bash
npm test                 # cargo check + cargo test + svelte-check
```

---

## ⚖️ License

[BSD-3-Clause](LICENSE) — Copyright (c) 2026, HELIX Origin. Independent client; not affiliated with nhentai.net.
