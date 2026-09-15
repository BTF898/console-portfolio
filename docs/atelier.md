# Atelier — the second site (editorial UI + real backend)

`sites/editorial/` is a second, independent portfolio site in the same repo.
It is the opposite of Console's dark terminal look: **light editorial/Swiss
design** — warm paper, serif display headings (Fraunces), one rust accent,
numbered sections — and, unlike Console, it ships a **real backend**.

## Stack

- **Astro 5** with the **Node adapter** (`@astrojs/node`, standalone mode).
  Every page is prerendered at build time; only `src/pages/api/*` routes opt
  out via `export const prerender = false` and run on the server.
- **SQLite** via `better-sqlite3`. The database file lives at
  `sites/editorial/data/atelier.db` (gitignored, auto-created on first use,
  WAL mode). No external database service.
- Fonts: Fraunces + Inter (fontsource, self-hosted).

## Run it

```bash
npm install                 # once; installs both workspaces
npm run dev:editorial       # dev server → http://localhost:4322
npm run build:editorial     # production build → sites/editorial/dist
npm run preview:editorial   # serve the built site (Node server)
```

The Console template at the repo root is untouched and still runs on 4321 —
both dev servers can run at the same time.

## The backend API

| Route | Method | Auth | What it does |
|---|---|---|---|
| `/api/contact` | POST | none | Validates + rate-limits (5/10min/IP), stores messages in SQLite. Honeypot `website` field and a fill-time check silently drop bots with a fake success. |
| `/api/cv.json` | GET | none | The full CV as JSON — the same data `/cv` renders. |
| `/api/inbox` | GET | Bearer | List contact messages (`?unread=1` to filter). |
| `/api/inbox/:id` | PATCH | Bearer | `{ "read": true \| false }` — mark read/unread. |
| `/api/inbox/:id` | DELETE | Bearer | Delete a message. |

Auth is a shared admin token: set `ADMIN_TOKEN` in the environment (see
`.env.example`). `src/middleware.ts` enforces it (timing-safe compare) on
everything under `/api/inbox`. The admin UI at `/admin/inbox` is static; you
paste the token once and it's kept in `sessionStorage`.

Note on CSRF: Astro's built-in origin check rejects body-mutating requests
without a JSON content type — the browser client always sends
`content-type: application/json`, so this only shows up if you curl without
the header.

## CV content (the accomplishment-focused part)

- `src/content/experience/*.md` — one file per role. The schema forces
  `highlights[]`, each with `text` (what you did) and optional `metric`
  (the number that proves it). Metric chips render inline on the site and
  as a field in `/api/cv.json`.
- `/cv` is a print-optimized page: the "Print / Save as PDF" button calls
  `window.print()` and `@media print` styles strip the nav/footer to a
  clean one-column document.
- `src/config/site.ts` holds the summary, skills groups, education, SEO.

## Configuration

Everything sitewide lives in `sites/editorial/src/config/site.ts` (same
single-tenant pattern as Console). Colors only via
`src/styles/tokens.css` — same rule as Console.

Set `SITE.url` to the production URL before deploying (drives canonical +
sitemap).

## Deployment

This site needs a **Node host** (it's not a static drop like Console):

- **Netlify/Vercel**: works, but switch the adapter — use
  `@astrojs/netlify` or `@astrojs/vercel` instead of `@astrojs/node` and set
  `ADMIN_TOKEN` in the host's env settings. The SQLite file works on a
  single instance; for serverless, mount a persistent volume or swap
  `src/lib/db.ts` for Turso/LibSQL (the query layer is already isolated).
- **VPS / any Node host**: `npm run build:editorial`, then
  `node sites/editorial/dist/server/entry.mjs` with `HOST`, `PORT`,
  `ADMIN_TOKEN` env vars. Put it behind nginx/Caddy for TLS.

## Test checklist (used for v0.1.0, re-run after API changes)

1. `GET /`, `/cv`, `/admin/inbox`, `/api/cv.json` → 200.
2. `POST /api/contact` valid → `{"ok":true}`, message appears in inbox.
3. Honeypot filled / fill-time < 3s → fake `{"ok":true}`, nothing stored.
4. Invalid payload → 400 with field errors. 6 rapid posts → 429 on the 6th.
5. `/api/inbox` without/wrong token → 401; correct token → list.
6. `PATCH`/`DELETE /api/inbox/:id` → `{ok:true}`, reflected in the UI.
