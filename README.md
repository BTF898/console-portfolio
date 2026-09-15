# Console — a portfolio template for engineers

A sellable, self-hosted portfolio template in the "engineer's console" style: blueprint-grid paper, a self-typing terminal, animated architecture diagrams, a live GitHub heatmap, a ⌘K command palette, exploration achievements, and a design-token theming system.

> **Note:** This repo also contains a second, independent portfolio site ("Atelier") with a light editorial/Swiss UI and a real backend. See the scripts table below.

**Built for three audiences at once:**

1. **You**, deploying a portfolio in minutes.
2. **Non-technical buyers**, editing everything through one config file per app — no code, no command line.
3. **Developers**, who get a clean Astro codebase with zero framework lock‑in to extend however they want.

---

## Why this stack (the 30‑second version)

- **Astro 5** prerenders every page to real HTML → crawlable by search engines, fast on any device (the analyzed original shipped an empty `<body>` + a ~530 KB JS bundle; this template ships full content with **~20 KB of JS total**).
- **Content collections** = "add a file, get a project." Schemas validate at build time with readable errors.
- **Vanilla TypeScript islands** — the terminal, palette, search and timeline are small scripts; there is no React/Vue runtime to ship.
- **One CSS token file per app** drives every color, radius, shadow and theme.

---

## Quickstart

You need [Node.js 20+](https://nodejs.org) installed. Then:

```bash
# 1. install dependencies (workspaces)
npm install

# 2. start both dev servers → http://localhost:4321 (Console) + http://localhost:4322 (Atelier)
npm run dev

# 3. make it yours — edit ONE config file per app:
#    apps/console/src/config/site.ts   (Console)
#    apps/atelier/src/config/site.ts   (Atelier)

# 4. edit content files (any editor, or the GitHub website):
#    apps/console/src/content/projects/*.mdx     Console work
#    apps/console/src/content/experience/*.md    Console jobs
#    apps/atelier/src/content/projects/*.mdx     Atelier work
#    apps/atelier/src/content/experience/*.md    Atelier jobs

# 5. build the production sites into dist/
npm run build
```

> **No command line at all?** Fork or "Use this template" on GitHub, then edit
> files through github.com's built‑in web editor (press `.` on your repo to
> open VS Code in the browser, or just click the ✏️ pencil on any file).
> Every commit auto‑deploys when the repo is connected to a host — see
> [docs/deployment.md](docs/deployment.md).

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload at `localhost:4321` (Console) + `localhost:4322` (Atelier) |
| `npm run dev:console` | Dev server with hot reload at `localhost:4321` |
| `npm run dev:atelier` | Dev server with hot reload at `localhost:4322` |
| `npm run build` | Production build → `apps/console/dist` + `apps/atelier/dist` |
| `npm run build:console` | Production build → `apps/console/dist` |
| `npm run build:atelier` | Production build → `apps/atelier/dist` |
| `npm run preview:console` | Serve the production Console build locally |
| `npm run preview:atelier` | Serve the production Atelier build locally |
| `npm run og` | Regenerate the placeholder `public/og.png` social-preview image |
| `npm run install-scripts` | Approve native‑module install scripts (esbuild, sharp, better-sqlite3) |

---

## What's in the box

| Section | Powered by | Edit it in |
|---|---|---|
| Console hero (avatar, name reveal, rotating roles, status) | `apps/console/src/config/site.ts` | `site.ts` |
| Console self‑typing terminal | `apps/console/src/config/terminal.ts` | `terminal.ts` |
| Console skills marquee | `apps/console/src/site.ts` → `skills` | `site.ts` |
| Console about + ID‑card facts | `apps/console/src/site.ts` → `about`, `facts` | `site.ts` |
| Console capability panels (3 cards) | `apps/console/src/site.ts` → `panels` | `site.ts` |
| Console featured projects + animated diagrams | `apps/console/src/content/projects/*.mdx` | content files |
| Console request‑flow strip | `apps/console/config/flow.ts` | `flow.ts` |
| Console GitHub heatmap + stats | `site.githubUsername` (fetched at **build** time) | `site.ts` |
| Console lab (searchable experiments) | `apps/console/src/content/lab/*.md` | content files |
| Console experience timeline | `apps/console/src/content/experience/*.md` | content files |
| Console more‑projects grid | non‑`featured` files in `projects/` | content files |
| Console contact (email, copy button, form) | `apps/console/src/site.ts` → `email`, `contact.formEndpoint` | `site.ts` |
| Console ⌘K command palette | rendered from config automatically | nothing to edit |
| Console exploration achievements | `apps/console/config/achievements.ts` | `achievements.ts` |
| Atelier hero (name reveal, role) | `apps/atelier/src/config/site.ts` | `site.ts` |
| Atelier selected work index list | `apps/atelier/src/content/projects/*.mdx` | content files |
| Atelier experience with metric chips | `apps/atelier/src/content/experience/*.md` | content files |
| Atelier capabilities | `apps/atelier/src/site.ts` → `skills` | `site.ts` |
| Atelier contact (form → API, rate‑limit, inbox) | `apps/atelier/src/scripts/contact-form.ts` | contact‑form TS |
| Atelier inbox (mark read/delete, token gate) | `apps/atelier/src/scripts/inbox-admin.ts` | inbox‑admin TS |
| Atelier capabilities panels | `apps/atelier/src/site.ts` → `panels` | `site.ts` |

Feature switches live in each app's `site.features` — flip `terminal`, `commandPalette`, `flow`, `github` or `achievements` to `false` and the whole section disappears cleanly.

---

## Second site: Atelier (`apps/atelier/`)

This repo also contains a second, independent portfolio site with a completely different look — **light editorial/Swiss** (serif display headings, warm paper, one rust accent, numbered sections) — and a **real backend**: Astro Node‑adapter API routes with SQLite for a spam‑filtered contact form, a token‑gated admin inbox (`/admin/inbox`), a JSON CV endpoint (`/api/cv.json`), and a print‑optimized `/cv` page focused on measurable accomplishments.

```bash
npm run dev:atelier      # → http://localhost:4322
npm run build:atelier    # production build (needs a Node host)
```

Details, API reference and deployment notes: [docs/atelier.md](docs/atelier.md).
---