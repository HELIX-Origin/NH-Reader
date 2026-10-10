---
layout: default
title: NH Reader
summary: NH Reader is a native desktop and Android client for nhentai.net with advanced search, a persistent global blacklist, and a fully local library.
header_actions:
  - title: Download releases ↗
    url: https://github.com/HELIX-Origin/NH-Reader/releases
    class: button--primary
  - title: Read docs
    url: /docs/
    class: button--secondary
---

<section id="about" class="doc-section">
<div class="section-heading">
<span class="section-number">01</span>
<div>
<p class="eyebrow">Overview</p>
<h2>What is NH Reader?</h2>
</div>
</div>
<p>
NH Reader is a native desktop and Android client for nhentai.net, not a browser-based reader.
Browse with powerful search and filters, organize your library, and apply a persistent global blacklist.
Your favorites, history, and settings are stored locally on your device.
</p>
</section>

<section id="features" class="doc-section">
<div class="section-heading">
<span class="section-number">02</span>
<div>
<p class="eyebrow">Highlights</p>
<h2>Features</h2>
</div>
</div>
<div class="features-grid">
<div class="feature-card">
<span class="feature-card__icon" aria-hidden="true">🔍</span>
<h3>Search &amp; filter</h3>
<p>Find galleries by language, category, tags, page count, and sort order.</p>
</div>
<div class="feature-card">
<span class="feature-card__icon" aria-hidden="true">🛡️</span>
<h3>Global blacklist</h3>
<p>Exclude unwanted tags from searches and hide or blur matches in discovery grids.</p>
</div>
<div class="feature-card">
<span class="feature-card__icon" aria-hidden="true">📚</span>
<h3>Local library</h3>
<p>Keep favorites and history on your device, download archives, and read them offline.</p>
</div>
</div>
</section>

<section id="docs" class="doc-section">
<div class="section-heading">
<span class="section-number">03</span>
<div>
<p class="eyebrow">Reference</p>
<h2>Documentation</h2>
</div>
</div>
<p>
Explore the complete guides and references on this site. The
<a href="{{ '/docs/' | relative_url }}">documentation directory</a> also links to every page.
</p>
<div class="documentation-directory">
<div>
<h3>User Guides</h3>
<ul>
{%- assign guide_pages = site.docs | sort: "nav_order" %}
{%- for doc in guide_pages %}
<li><a href="{{ doc.url | relative_url }}">{{ doc.title | escape }}</a></li>
{%- endfor %}
</ul>
</div>
<div>
<h3>Technical Wiki</h3>
<ul>
{%- assign wiki_pages = site.wiki | sort: "nav_order" %}
{%- for doc in wiki_pages %}
<li><a href="{{ doc.url | relative_url }}">{{ doc.title | escape }}</a></li>
{%- endfor %}
</ul>
</div>
</div>
</section>

<section id="downloads" class="doc-section">
<div class="section-heading">
<span class="section-number">04</span>
<div>
<p class="eyebrow">Install</p>
<h2>Get NH Reader</h2>
</div>
</div>
<p>
Windows and Linux packages are supported. macOS and Android builds are available through
their toolchains but remain untested on physical devices. iOS is not supported.
</p>
<div class="header-actions">
<a class="button button--primary" href="https://github.com/HELIX-Origin/NH-Reader/releases">Download releases ↗</a>
<a class="button button--secondary" href="{{ '/docs/' | relative_url }}">Read documentation</a>
</div>
</section>
