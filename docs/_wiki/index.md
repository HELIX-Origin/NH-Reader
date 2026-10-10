---
layout: wiki
title: NH Reader Technical Wiki
summary: Deep architectural specifications, Rust backend internals, SvelteKit frontend reactive state models, security analysis, and installer packaging pipelines.
permalink: /wiki/
nav_order: 1
---

<section class="doc-section">
  <div class="section-heading">
    <span class="section-number">01</span>
    <div>
      <p class="eyebrow">Architecture & Engine</p>
      <h2>Core Internals</h2>
    </div>
  </div>
  <p>
    Technical blueprints and implementation details of the NH Reader application runtime:
  </p>
  <ul>
    <li><a href="{{ '/wiki/Architecture/' | relative_url }}"><strong>Architecture Overview</strong></a> — Tauri multi-process architecture, IPC message protocol, and local SQLite database engine.</li>
    <li><a href="{{ '/wiki/Backend-Rust/' | relative_url }}"><strong>Backend (Rust)</strong></a> — Native Tokio asynchronous runtime, scraping pipeline, caching layer, and security sandbox.</li>
    <li><a href="{{ '/wiki/Frontend-SvelteKit/' | relative_url }}"><strong>Frontend (SvelteKit)</strong></a> — Virtualized gallery grids, reactive store architecture, and performance optimizations.</li>
  </ul>
</section>

<section class="doc-section">
  <div class="section-heading">
    <span class="section-number">02</span>
    <div>
      <p class="eyebrow">Engineering & Toolchain</p>
      <h2>Toolchain & Packaging</h2>
    </div>
  </div>
  <p>
    Build pipelines, cross-platform packaging, and contribution standards:
  </p>
  <ul>
    <li><a href="{{ '/wiki/Installer-Engine/' | relative_url }}"><strong>Packaging & Bundling</strong></a> — NSIS installer logic, AppImage/deb Linux bundling, and auto-updater signatures.</li>
    <li><a href="{{ '/wiki/Development-and-Contributing/' | relative_url }}"><strong>Development & Contributing</strong></a> — Local workspace setup, test suites, and pull request guidelines.</li>
  </ul>
</section>

<section class="doc-section">
  <div class="section-heading">
    <span class="section-number">03</span>
    <div>
      <p class="eyebrow">Assurance</p>
      <h2>Security & Privacy</h2>
    </div>
  </div>
  <p>
    Security boundaries and local-first data protection guarantees:
  </p>
  <ul>
    <li><a href="{{ '/wiki/Security/' | relative_url }}"><strong>Security Policy</strong></a> — Threat model, content isolation, and vulnerability disclosure process.</li>
    <li><a href="{{ '/wiki/Privacy/' | relative_url }}"><strong>Privacy Guarantees</strong></a> — Zero-telemetry policy, offline-first storage, and local data persistence.</li>
  </ul>
</section>
