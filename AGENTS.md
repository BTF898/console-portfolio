# AGENTS.md — instructions for AI coding agents (and cautious humans)

You are working on **Console**, a sellable one-page portfolio template built
with Astro 5. Everything a visitor sees comes from files in this repo; there
is no backend, no database, and no runtime API. The output of `npm run build`
is a `dist/` folder of static files that any static host can serve.

> **Note (two sites in one repo):** `sites/editorial/` is a second, separate
> Astro site ("Atelier") with its own UI, config, content and a real backend
> (Node adapter + SQLite API routes). The rules below apply to the root
> Console site; Atelier has its own `sites/editorial/src/config/site.ts` and
> its own `sites/editorial/src/styles/tokens.css` (same token discipline).
> Atelier runs on port 4322 (`npm run dev:editorial` / `build:editorial`);
> see `docs/atelier.md`. If you touch only root files, `npm run build` is
> still the gate; if you touch Atelier, `npm run build:editorial` must also
> pass.

If you can follow the recipes below, you can do any task on this repo. When
in doubt: make the change, run `npm run build`, and it must pass.

---

## 0. Non-negotiable rules

1. **Never copy content from amantiwari.co.in** (the analyzed reference site).
   Its code, name, avatar, projects and text are all-rights-reserved. The
   template's demo persona ("Sam Rivera") and all demo projects are fictional
   on purpose. Keep them fictional unless the user supplies real content.
2. **Colors only via tokens.** Never hard-code a hex value in a component.
   All colors/radii/shadows live in `src/styles/tokens.css`. Components read
   CSS custom properties only.
3. **Line endings are LF** (`.gitattributes` enforces it). Don't fight it.
4. **Never commit secrets.** `.env` files, form-service keys, tokens — no.
   The template has none and needs none.
5. **`npm run build` must pass before you finish.** It exits non-zero on
   broken content and names the file + field. Fix what it names.
6. **One config file is sacred:** `src/config/site.ts`. Almost every
   site-wide setting lives there and is heavily commented. Read it first.

## 1. Environment setup

- Node.js **20 or newer** required (`node -v` to check). If `node` is not
  found: install from nodejs.org, then `npm install` in the repo root.
- Windows note: this repo was developed in Git Bash. In PowerShell/cmd all
  `npm run …` commands work identically.

```bash
npm install      # once, after cloning
npm run dev      # dev server → http://localhost:4321 (hot reload)
npm run build    # production build → dist/ (also writes robots.txt + sitemap)
npm run preview  # serves dist/ locally to verify the built site
npm run og       # regenerates public/og.png (social preview image)
```

## 2. File map (what lives where)

| Path | Purpose |
|---|---|
| `src/config/site.ts` | **Buyer config**: name, roles, socials, skills, theme, feature switches, SEO |
| `src/config/terminal.ts` | Script the hero terminal types (commands + output lines) |
| `src/config/flow.ts` | The animated request-flow strip's lanes |
| `src/config/achievements.ts` | Labels/hints for the exploration achievements |
| `src/content/projects/*.mdx` | One file per project (schema in §3) |
| `src/content/experience/*.md` | One file per job |
| `src/content/lab/*.md` | One file per experiment card |
| `src/content.config.ts` | Zod schemas that validate the content files |
| `src/components/*.astro` | One component per page section |
| `src/scripts/*.ts` | Small vanilla-TS islands (terminal, palette, search…) |
| `src/layouts/Base.astro` | `<head>`, SEO tags, JSON-LD, nav/footer wiring |
| `src/styles/tokens.css` | All design tokens + the theme presets |
| `src/styles/components.css` | All component styles |
| `public/` | Static files: avatar, favicon, og.png, Decap CMS (`admin/`) |
| `docs/` | Deep guides: content, theming, deployment, selling |

## 3. Content recipes (most common tasks)

### Change the person / branding / socials
Edit `src/config/site.ts`. Fields are commented. `site.url` must be the
production URL (drives canonical/OG/sitemap). Set `githubUsername: ''`
(empty) to show labeled demo heatmap data; a real username fetches real data
at build time.

### Add a project
Create `src/content/projects/my-project.mdx`:

```mdx
---
title: 'My Project'
tagline: 'SHORT KICKER'
summary: 'One paragraph describing it.'
year: 2025
stack: ['TypeScript', 'Postgres']
metrics:
  - { value: '99.9%', label: 'uptime' }
points:
  - 'Bullet: what you built / how'
links:
  live: 'https://example.com'   # optional
  repo: 'https://github.com/…'  # optional
featured: false   # true = big section + architecture diagram
order: 10         # lower numbers sort first
---
Body markdown (optional) — extra detail under the summary.
```

**Diagrams (featured projects only, optional):** `diagram.nodes` places
labeled boxes on a grid (`col: 0–5`, `row: 0–3`), `diagram.edges` connects
node ids as `['fromId', 'toId']` pairs, `diagram.hot` highlights one node.
Copy the pattern from `src/content/projects/relay.mdx`.

### Add a job or a lab card
- Job: `src/content/experience/acme.md` with frontmatter `company`, `role`,
  `start: '2022-03'`, `end: '2024-01'` (or `end: null` = present), `order`.
- Lab: `src/content/lab/tool.md` with `name`, `note`, `glyph`
  (one of: `spin`, `pulse`, `scan`, `draw`, `blink`), `link`, `order`.

### Change the look
- Switch preset: `site.theme.preset` = `'forest' | 'midnight' | 'reference'`
  in `src/config/site.ts` (plus `mode: 'dark' | 'light'`).
- Restyle anything: edit tokens in `src/styles/tokens.css`. `reference` is
  the reconstruction of the analyzed reference design (see DESIGN-ANALYSIS.md).
- Visitor theme choice persists in localStorage key `console-mode`.

### Toggle sections off
`site.features` in `src/config/site.ts`: `terminal`, `commandPalette`,
`flow`, `github`, `achievements`. Set any to `false` — the section and its
script disappear cleanly from the build.

### Contact form
Empty `site.contact.formEndpoint` (default) shows email CTAs only. Paste a
Formspree/Web3Forms/Basin endpoint to activate the form — no other change
needed.

## 4. Verify your work (do this every time)

1. `npm run build` → must complete with 0 errors.
2. `npm run preview` → open http://127.0.0.1:4321 and check the section you
   touched (and the footer achievements meter still fills in).
3. Changed content? Check the build output didn't emit a schema warning.
4. Changed styles? Check BOTH `?` light mode (footer sun icon) and dark.

Common build errors, decoded:
- `projects → my-project → year: Required` → the frontmatter is missing
  `year` (the error always names collection → file → field).
- `diagram.edges → invalid input` → an edge references a node id that
  doesn't exist, or nodes/edges shape is wrong.
- `Collected metadata file is not valid` → frontmatter YAML syntax (unclosed
  quote, bad indent).

## 5. Deployment (summary — full guide in docs/deployment.md)

The site deploys as static files. Netlify/Vercel/Cloudflare Pages: import the
repo, zero config. GitHub Pages: workflow `.github/workflows/deploy-pages.yml`
is included (manual trigger by design). After any host connect: set
`site.url` to the real domain and redeploy. Operating cost is $0 — no
functions, no database.

## 6. Git conventions

- `main` is the product. The `reference-design` branch carries the
  `reference` preset as default; everything else is identical.
- Commit messages: plain imperative summary line, blank line, optional body.
- The remote uses gh CLI as its credential helper (`gh auth setup-git` was
  run); `git push` needs no extra auth on this machine.

## 7. Deeper docs

- `docs/content.md` — full field reference + expansion ideas (blog, case studies)
- `docs/theming.md` — token anatomy, how to create a fourth preset
- `docs/deployment.md` — hosts, domains, forms, CMS, cost breakdown
- `docs/atelier.md` — the second site in `sites/editorial/` (editorial UI + backend)
- `docs/selling.md` — packaging this as a product
- `DESIGN-ANALYSIS.md` — the design teardown that inspired the template
- `CHANGELOG.md` — release history (currently v1.1.0)
