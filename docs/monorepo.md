# Monorepo layout

This repo restructured from a single‑site Astro template into a workspace with
two independent applications (`apps/console` and `apps/atelier`) and two shared
packages (`packages/tsconfig`, `packages/cv-contract`).

## Packages

| Package | Purpose | Consumers |
|---|---|---|
| `packages/tsconfig` | A minimal `astro.json` that extends `astro/tsconfigs/strict`. Both apps extend it via `"extends": "@portfolio/tsconfig/astro.json"`. | `apps/console/tsconfig.json`, `apps/atelier/tsconfig.json` |
| `packages/cv-contract` | Plain‑module‑v2 npm package (no build step). Exports the zod schema for `/api/cv.json`, inferred types, and the date formatters `formatMonth` / `formatRange`. | `apps/atelier/src/pages/api/cv.json.ts` (validates API response); also importable by any other service that renders a CV. |

## Applications

| Application | Port | Root | Config | Main output |
|---|---|---|---|---|
| `apps/console` | 4321 | the original Console site — dark terminal UI, Astro 5, static, no backend | `astro.config.mjs`, `src/config/site.ts` | `dist/index.html`, `dist/og.png` |
| `apps/atelier` | 4322 | the new editorial/Swiss site — real backend (Node adapter + SQLite API routes) | `astro.config.mjs`, `src/config/site.ts` | `dist/index.html`, `cv.json`, API endpoints |

## Running both

```bash
# From repo root
npm run dev          # Console 4321 + Atelier 4322 concurrently
npm run dev:console  # Console only
npm run dev:atelier  # Atelier only
```

## Building

```bash
npm run build          # builds both apps (Console first, then Atelier)
npm run build:console  # Console only
npm run build:atelier  # Atelier only
```

## Deployment per app

- **Netlify**: set the site's *build command* to `npm run build:console` and the *publish directory* to `apps/console/dist`. Same pattern for Atelier with `npm run build:atelier` / `apps/atelier/dist`.
- **Vercel / Cloudflare Pages**: auto‑detect Astro. Point the root to the repo; Vercel/Cloudflare will run the root `npm run build` script which builds both apps. If you only want one app, set the relevant `npm run build:*` script as the root build command and configure the deploy platform to publish the corresponding `apps/*/dist`.
- **GitHub Pages**: the included `.github/workflows/deploy-pages.yml` deploys `apps/console/dist` only (Console). For Atelier, create a second Pages site that publishes `apps/atelier/dist` with its own workflow (or reuse the Console workflow and change the `path` field).

## Adding a new app

1. `mkdir apps/<new-app>` and `cd apps/<new-app>`.
2. `git mv` or copy the relevant app source from `apps/console` / `apps/atelier` preserving history.
3. Create `apps/<new-app>/package.json` with exactly the dependencies the app needs (Astro, fontsource packages, any native deps). Add it to the root `workspaces` array.
4. Create `apps/<new-app>/astro.config.mjs` (or inherit from the nearest parent config; each app currently has its own).
5. Add a script line to the root `package.json`: `"dev:<new-app>", "build:<new-app>"`, etc.
6. If the new app needs its own shared package, create `packages/<new-package>` with its own `package.json` and `src/`, then add it to the root workspaces.
7. Commit on a feature branch; merge to `main` after verification.

## Adding a new shared package

1. `mkdir packages/<new-package>` and `cd packages/<new-package>`.
2. Create `packages/<new-package>/package.json` (name `@portfolio/<new-package>`, `type: "module"`).
3. Add source files under `src/` (plain TS, schema definitions, formatters — nothing that needs a build step; Astro/Vite will transpile workspace‑linked TS on the fly).
4. Add the package to the root `workspaces` array: `"packages/*"` (already there; you may need to `npm install` again after adding the directory).
5. In any app that consumes it, add `"@portfolio/<new-package>": "*"` to its `package.json` `dependencies`.
6. Commit; the new package is immediately available as a workspace import.

## Verification

- `npm install` from root must succeed; all `apps/*` and `packages/*` deps are hoisted and available.
- `npm run build` builds Console first (must pass), then Atelier.
- `npm run dev:console` opens http://127.0.0.1:4321; `npm run dev:atelier` opens http://127.0.0.1:4322.
- API contract: `GET /api/cv.json` passes zod validation against `@portfolio/cv-contract`.
- Inbox auth: `GET /api/inbox` requires correct `Authorization: Bearer <ADMIN_TOKEN>`; 401 otherwise; `PATCH`/`DELETE` protected.
- Console’s `npm run preview:console` serves the Console dist; Atelier’s `npm run preview:atelier` serves the Atelier dist.