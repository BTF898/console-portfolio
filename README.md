# Console — a portfolio template for engineers

A sellable, self-hosted portfolio template in the "engineer's console" style: blueprint-grid paper, a self-typing terminal, animated architecture diagrams, a live GitHub heatmap, a ⌘K command palette, exploration achievements, and a design-token theming system.

**Built for three audiences at once:**

1. **You**, deploying a portfolio in minutes.
2. **Non-technical buyers**, editing everything through one config file, a CMS, or the GitHub web editor — no code, no command line.
3. **Developers**, who get a clean Astro codebase with zero framework lock-in to extend however they want.

---

## Why this stack (the 30-second version)

- **Astro 5** prerenders every page to real HTML → crawlable by search engines, fast on any device (the analyzed original shipped an empty `<body>` + a ~530 KB JS bundle; this template ships full content with **~20 KB of JS total**).
- **Content collections** = "add a file, get a project." Schemas validate at build time with readable errors.
- **Vanilla TypeScript islands** — the terminal, palette, search and timeline are small scripts; there is no React/Vue runtime to ship.
- **One CSS token file** drives every color, radius, shadow and theme.

---

## Quickstart

<!-- One-click deploys — point the button URLs at your repo after forking. -->
<p>
  <a href="https://app.netlify.com/start/git/repo?a=rollup-adapter" target="_blank" rel="noopener"><img alt="Deploy to Netlify" src="https://www.netlify.com/img/deploy/button.svg" height="32"></a>
  &nbsp;
  <a href="https://vercel.com/new/clone" target="_blank" rel="noopener"><img alt="Deploy to Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel" height="32"></a>
</p>

You need [Node.js 20+](https://nodejs.org) installed. Then:

```bash
# 1. install dependencies
npm install

# 2. start the dev server → http://localhost:4321
npm run dev

# 3. make it yours — edit ONE file in any text editor:
#    src/config/site.ts   (name, role, socials, skills, theme, …)
#
# 4. edit content files (any editor, or the GitHub website):
#    src/content/projects/*.mdx     your work
#    src/content/experience/*.md    your jobs
#    src/content/lab/*.md           your experiments

# 5. build the production site into dist/
npm run build
```

> **No command line at all?** Fork or "Use this template" on GitHub, then edit
> files through github.com's built-in web editor (press `.` on your repo to
> open VS Code in the browser, or just click the ✏️ pencil on any file).
> Every commit auto-deploys when the repo is connected to a host — see
> [docs/deployment.md](docs/deployment.md).

---

## What's in the box

| Section | Powered by | Edit it in |
|---|---|---|
| Hero (avatar, name reveal, rotating roles, status) | `src/config/site.ts` | `site.ts` |
| Self-typing terminal | `src/config/terminal.ts` | `terminal.ts` |
| Skills marquee | `src/config/site.ts` → `skills` | `site.ts` |
| About + ID-card facts | `src/config/site.ts` → `about`, `facts` | `site.ts` |
| Capability panels (3 cards) | `src/config/site.ts` → `panels` | `site.ts` |
| Featured projects + animated diagrams | `src/content/projects/*.mdx` | content files |
| Request-flow strip | `src/config/flow.ts` | `flow.ts` |
| GitHub heatmap + stats | `site.githubUsername` (fetched at **build** time) | `site.ts` |
| Lab (searchable experiments) | `src/content/lab/*.md` | content files |
| Experience timeline | `src/content/experience/*.md` | content files |
| More-projects grid | non-`featured` files in `projects/` | content files |
| Contact (email, copy button, form) | `site.ts` → `email`, `contact.formEndpoint` | `site.ts` |
| ⌘K command palette | rendered from config automatically | nothing to edit |
| Exploration achievements | `src/config/achievements.ts` | `achievements.ts` |

Feature switches live in `site.features` — flip `terminal`, `commandPalette`, `flow`, `github` or `achievements` to `false` and the whole section disappears cleanly.

---

## The golden rules

1. **`src/config/site.ts` is the only file most people ever need to touch.** Everything reads from it.
2. **Content = files.** One markdown file per project/job/experiment. Add, edit, delete files — the page rebuilds itself.
3. **Design = tokens.** All colors/radii/shadows live in `src/styles/tokens.css`. Never hard-code a color in a component.
4. **Builds don't lie.** Content schemas are validated on every build — a missing field fails loudly with the file and field named, never silently breaks the page.

## Documentation map

| Doc | Read it when you want to… |
|---|---|
| [docs/content.md](docs/content.md) | add projects/jobs/lab items, build diagrams, add a blog later |
| [docs/theming.md](docs/theming.md) | change colors, create a preset, adjust type & spacing |
| [docs/deployment.md](docs/deployment.md) | deploy, set a domain, wire the contact form, enable the CMS |
| [docs/selling.md](docs/selling.md) | package, license and support this as a product |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload at `localhost:4321` |
| `npm run build` | Production build → `dist/` (also regenerates `robots.txt` + sitemap) |
| `npm run preview` | Serve the production build locally |
| `npm run og` | Regenerate the placeholder `public/og.png` social-preview image |

## Quality you inherit

- Real HTML for every section (SEO, no-JS visitors, screen readers)
- Open Graph + Twitter card tags, canonical URLs, JSON-LD `Person` schema, sitemap, robots.txt — all generated from config
- `prefers-reduced-motion` support in every animated component (the marquee reflows to a static row; the terminal renders instantly)
- Skip-link, focus-visible styles, semantic landmarks, `aria-hidden` on decorative layers
- Theme persistence without flash-of-wrong-theme (inline bootstrap script)
- Self-hosted variable fonts (Recursive + JetBrains Mono) — zero font CDN requests
- **Runs for $0, forever**: the whole site is ~0.5 MB of static files with ~20 KB of JS and no backend — free tiers on Cloudflare/Netlify/Vercel/GitHub Pages cover roughly 200k+ page views a month (see [docs/deployment.md](docs/deployment.md))

## Credits & provenance

The design *patterns* (terminal hero, palette, heatmap, grid paper) are inspired by the current generation of engineer portfolios, including [amantiwari.co.in](https://amantiwari.co.in/) — analyzed in [DESIGN-ANALYSIS.md](DESIGN-ANALYSIS.md). **All code, content and visual identity in this template are original.** It is not affiliated with, endorsed by, or derived from that site's code. The demo persona ("Sam Rivera") and all projects are fictional placeholders — replace them.
