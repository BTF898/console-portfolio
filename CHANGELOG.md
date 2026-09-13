# Changelog

All notable changes to the Console portfolio template. Releases are tagged in
git so buyers can pull fixes into their copies.

## [1.1.0] — 2026-09-14

### Added
- **Exploration achievements** — the engagement hook: visitors unlock
  console-flavored badges as they explore (open the palette, toggle the
  theme, watch a full terminal cycle, reach the footer, find the Konami
  code…), with a progress meter in the footer and localStorage persistence.
  Configured in `src/config/achievements.ts`; one switch
  (`features.achievements`) hides the whole system.
- GitHub Pages deploy workflow (`.github/workflows/deploy-pages.yml`) —
  manual-trigger by design, so it stays silent until Pages is enabled.
- Deployment guide now documents the operating cost: ~0.5 MB of static
  files, no backend, free tiers covering ~200k page views/month.

### Fixed
- Mobile menu now resets `aria-expanded` when closed via a link click.

## [1.0.0] — 2026-09-14

First public release.

### Added
- One-page portfolio: hero (avatar, word-reveal name, rotating roles, status
  badge), skills marquee, featured projects with animated SVG architecture
  diagrams, request-flow strip, GitHub contribution heatmap (fetched at build
  time), searchable Lab grid, scroll-filled experience timeline, about +
  ID-card, capability panels, more-projects grid, contact section
- ⌘K / Ctrl-K command palette with filtering and keyboard navigation
- Self-typing terminal with static no-JS/screen-reader fallback
- Two theme presets (`forest`, `midnight`), dark + light modes, persisted
  without flash-of-wrong-theme
- Content collections (projects / experience / lab) with build-time schema
  validation and human-readable errors
- Single-file buyer config: `src/config/site.ts`
- Decap CMS admin at `/admin/` (git-based, editorial workflow)
- SEO: prerendered HTML for every section, canonical URLs, Open Graph +
  Twitter cards, JSON-LD Person schema, sitemap, robots.txt
- Accessibility: skip link, focus-visible styles, reduced-motion support in
  every animated component
- Zero-config deploys: `netlify.toml`, GitHub Actions CI, deploy buttons
- Docs: content, theming, deployment and selling guides
