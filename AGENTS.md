# AGENTS.md — instructions for AI coding agents (and cautious humans)

This is a monorepo. Three packages live in `packages/`, and two applications live in `apps/`:

| Package / App | Purpose | Entry point |
|---|---|---|
| `packages/tsconfig` | Shared base tsconfig for every app; no build step | — |
| `packages/cv-contract` | CV contract: zod schema, inferred types, date formatters (`formatMonth`, `formatRange`) | `src/index.ts` |
| `apps/console` | The original Console site — dark terminal UI, Astro 5, zero backend | `apps/console/src/`, `apps/console/astro.config.mjs` |
| `apps/atelier` | The new editorial/Swiss site — real backend: SQLite API routes (contact + inbox), `/api/cv.json` | `apps/atelier/src/`, `apps/atelier/astro.config.mjs` |

## Non-negotiable rules

1. **Never copy content from amantiwari.co.in** (the analyzed reference site). Its code, name, avatar, projects and text are all‑rights‑reserved. The template's demo persona ("Sam Rivera") and all demo projects are fictional on purpose. Keep them fictional unless the user supplies real content.
2. **Colors only via tokens.** Never hard‑code a hex value in a component. All colors/radii/shadows live in the **per‑app** tokens.css (`apps/console/src/styles/tokens.css` / `apps/atelier/src/styles/tokens.css`). Components read CSS custom properties only.
3. **Line endings are LF** (`.gitattributes` enforces it). Don't fight it.
4. **Never commit secrets.** `.env` files, form-service keys, tokens — no. `apps/console/.env`, `apps/atelier/.env` are git‑ignored; each app has its own `.env.example` in its root.
5. **`npm run build` (from root) must pass.** It builds both `apps/console` and `apps/atelier`. Either workspace's build failing exits non‑zero. Fix what it names.
6. **One config file per app is sacred:** `apps/<app>/astro.config.mjs`. Almost every site‑wide setting lives there and is heavily commented. Read it first.
7. **`npm run build` (root) builds Console first, then Atelier.** Console's build must pass before Atelier's is attempted; if Console fails, `npm run build` exits non‑zero. Either app's build failure is named with the file + field — fix what it names.
8. **Do not run `npm install` from `apps/*` or `packages/*` directly.** Always run `npm install` from the repo root. The workspaces install all deps in a single operation. Running it from inside a sub‑directory silently reinstalls a minimal set and will not have the full dependency graph.
9. **Each app may run its own dev server independently.** `npm run dev:console` starts Console on port 4321; `npm run dev:atelier` starts Atelier on port 4322. They may run simultaneously.
10. **The `reference-design` branch does NOT carry the new layout.** It will conflict on any future merge into the new layout — flagged, out of scope.

## 1. Environment setup

- Node.js **20 or newer** required (`node -v` to check). If `node` is not found: install from nodejs.org, then `npm install` in the repo root.
- Windows note: this repo was developed in Git Bash. In PowerShell/cmd all `npm run …` commands work identically.

```bash
npm install      # once, after cloning — installs all workspaces
npm run dev      # starts *both* dev servers concurrently (Console 4321 + Atelier 4322)
npm run dev:console   # dev server → http://localhost:4321 (hot reload, Console)
npm run dev:atelier   # dev server → http://localhost:4322 (hot reload, Atelier)
npm run build      # production build → dist/ (also writes each app's sitemap)
npm run build:console   # build Console only
npm run build:atelier   # build Atelier only
npm run preview:console   # serves apps/console/dist locally to verify
npm run preview:atelier   # serves apps/atelier/dist locally to verify
npm run og          # regenerates public/og.png (from apps/console, legacy)
```

## 2. File map (what lives where)

| Path | Purpose |
|---|---|
| `apps/console/src/` | Console source: Astro components, config, lib islands, content collections |
| `apps/console/astro.config.mjs` | Console config (site URL, SEO, integrations, output) |
| `apps/console/src/styles/tokens.css` | Console design tokens (colors, radii, shadows, presets) |
| `apps/console/src/content/experience/*.md` | Experience entries |
| `apps/console/src/content/projects/*.mdx` | Project entries |
| `apps/console/scripts/*.ts` | Small vanilla‑TS islands (terminal, palette, search…) |
| `apps/console/public/` | Static files: avatar, favicon, og.png |
| `apps/layouts/Base.astro` | Wired into Console's Base layout |
| `apps/atelier/src/` | Atelier source: same shape as the original `sites/editorial/` but lives inside the monorepo workspace |
| `apps/atelier/astro.config.mjs` | Atelier config (node adapter, its own `site` URL, API integrations) |
| `apps/atelier/src/styles/tokens.css` | Atelier design tokens (warm paper, serif headings, one rust accent) |
| `apps/atelier/src/content/experience/*.md` | Experience entries (richer than Console's, with metric‑chip schema) |
| `apps/atelier/src/content/projects/*.mdx` | Project entries |
| `apps/atelier/src/scripts/contact-form.ts` | Form POST → `/api/contact` with Zod validation, honeypot + rate limit |
| `apps/atelier/src/scripts/inbox-admin.ts` | Admin UI for the token‑gated inbox |
| `apps/atelier/src/layouts/Base.astro` | Atelier's own `<head>`, SEO, JSON‑LD, nav/footer |
| `packages/tsconfig/astro.json` | Shared tsconfig (extends `astro/tsconfigs/strict`) used by both apps |
| `packages/cv-contract/src/index.ts` | CV zod response schema + type exports + `formatMonth` / `formatRange` helpers |
| `package.json` (root) | `workspaces: ["apps/*", "packages/*"]`, `concurrently`, dev/build/preview scripts |
| `.github/workflows/ci.yml` | CI builds both apps; every push to `main` must succeed for both |
| `.github/workflows/deploy-pages.yml` | Deploys Console to GitHub Pages from `apps/console/dist` (manual on purpose) |
| `netlify.toml` | Deploys Console to Netlify from `apps/console/dist` |
| `AGENTS.md` | This file — rules, scripts, file map, verification |
| `README.md` | Overview + per‑app scripts table |
| `docs/` | Deep docs: `content.md`, `theming.md`, `deployment.md`, `selling.md`, `monorepo.md`, `atelier.md` |

## 3. Common tasks (most used)

### Change the person / branding / socials

- **Console:** Edit `apps/console/src/config/site.ts` only.
- **Atelier:** Edit `apps/atelier/src/config/site.ts` only.

### Add a project

- **Console:** Create `apps/console/src/content/projects/my-project.mdx` (same schema as before).
- **Atelier:** Create `apps/atelier/src/content/projects/my-project.mdx` (same schema as before).

### Add a job or a lab card

- **Console:** `apps/console/src/content/experience/acme.md` with frontmatter `company`, `role`, `start: '2022-03'`, `end: '2024-01'` (or `end: null` = present), `order`.
- **Atelier:** `apps/atelier/src/content/experience/acme.md` with `name`, `note`, `glyph` (one of: `spin`, `pulse`, `scan`, `draw`, `blink`), `link`, `order`.

### Change the look

- **Console:** Restyle tokens in `apps/console/src/styles/tokens.css`. `:root[data-preset='forest']` and `[data-mode='light']` selectors. Dark values on `:root`, light under `[data-mode=light]`.
- **Atelier:** Restyle tokens in `apps/atelier/src/styles/tokens.css`. `:root[data-preset='forest']` and `[data-mode='light']` selectors. (Two presets exist: `forest` and `midnight`; the default is `forest`.)

### Toggle sections off

`site.features` in each app's `src/config/site.ts`: `terminal`, `commandPalette`, `flow`, `github`, `achievements`. Set any to `false` — the section and its script disappear cleanly from the build.

### Contact form

- **Console:** Empty `site.contact.formEndpoint` (default) shows email CTAs only. Paste a Formspree/Web3Forms/Basin endpoint to activate the form — no other change needed.
- **Atelier:** Already active: `POST /api/contact` (validates + rate‑limits + stores in SQLite). The form `action` is set to `/api/contact` and the frontend sends JSON. No third‑party endpoint needed.

### Verification checklist

1. Fresh `npm install` at repo root — must succeed (workspaces install all deps).
2. `npm run build` → must complete building both apps with 0 errors.
3. After a build, start Console: `npm run preview:console`; open http://127.0.0.1:4321 and check the Console sections you touched (and the footer achieves meter still fills in).
4. After a build, start Atelier: `npm run preview:atelier`; open http://127.0.0.1:4322 and check the sections you touched.
5. Changed content? Check the build output didn't emit a schema warning.
6. Changed styles? Check both Console's `?` light mode (footer sun icon) and dark; check Atelier's light mode and dark.
7. CV API: curl `GET /api/cv.json` → JSON with `person`, `summary`, `skills`, `education`, `experience` fields, validated against `@portfolio/cv-contract`. `POST /api/contact` valid → stored; honeypot + too‑fast silently dropped; 6th rapid post → 429.
8. Inbox: `/api/inbox` without bearer token → 401; with correct token → list; `PATCH`/`DELETE` protected.
9. Run `npm run og` → generates `public/og.png` from Console's palette (legacy; unchanged).

## 4. Deeper docs

- `docs/content.md` — full field reference + expansion ideas (blog, case studies)
- `docs/theming.md` — token anatomy, how to create a fourth preset (same shape as the two existing ones, referenced from `apps/<app>/src/styles/tokens.css`)
- `docs/deployment.md` — hosts, domains, forms, CMS, cost breakdown; split per‑app Netlify/Vercel notes
- `docs/selling.md` — packaging this as a product
- `docs/monorepo.md` — new: layout explanation, how to add app #3 or package #2, deployment per app
- `docs/atelier.md` — the second site in `apps/atelier/` (editorial UI + embedded API + SQLite, how to set `ADMIN_TOKEN`)
- `AGENTS.md` — this file — rules, scripts, file map, verification
- `CHANGELOG.md` — release history

## 5. Git conventions

- `main` is the product. The `reference-design` branch carries the `reference` preset as before; everything else is on `feature/atelier` in development.
- Commit messages: plain imperative summary line, blank line, optional body.
- The remote uses gh CLI as its credential helper (`gh auth setup-git` was run); `git push` needs no extra auth on this machine.

## 6. Known gotchas (merge time)

- After merging to `main`, CI / Netlify / Vercel config must be re‑pointed: Netlify publish path changes from `dist/` to `apps/console/dist`; GitHub Pages workflow uploads `apps/console/dist`. This is a one‑time config update after merge.
- CI builds both apps; if either breaks, the CI job goes red even if the other one is fine. The CI job cannot be simplified to Console‑only until Atelier is removed from the repo.