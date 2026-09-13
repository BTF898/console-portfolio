# Deployment guide

The site is 100% static (`dist/`). Any static host works; the big three
auto-detect Astro with zero configuration.

## 1. Put it on GitHub

```bash
git init && git add -A && git commit -m "Console portfolio"
git remote add origin https://github.com/you/your-portfolio.git
git push -u origin main
```

## 2. Connect a host

| Host | How | Notes |
|---|---|---|
| **Vercel** | Import the repo → framework "Astro" is auto-detected → Deploy | Zero config. |
| **Netlify** | Import the repo → `netlify.toml` in this repo supplies build + publish | Zero config. |
| **Cloudflare Pages** | Connect repo → framework preset "Astro" | Zero config. Free CDN + unlimited bandwidth. |
| **GitHub Pages** | `.github/workflows/deploy-pages.yml` is included — enable Pages (Settings → Pages → Source: *GitHub Actions*), uncomment the `push:` trigger, run | Set `site`/`base` in `astro.config.mjs` if serving from a subpath (`/repo-name/`). |

`.github/workflows/ci.yml` already builds on every push/PR so breakage is
caught before deploy.

## What it costs: nothing

The build output is plain files — no server, no functions, no database, no
API keys on the client. Any free static tier runs it indefinitely:

- **Whole site: ~0.5 MB** (about half of that is the two self-hosted variable
  fonts). JavaScript for the entire page: **~20 KB**. CSS: ~44 KB.
- **No runtime compute**: every page is HTML at the edge/CDN; the GitHub
  heatmap is fetched once at build time, so visitors never hit an API.
- **Free-tier reality on each host:** Cloudflare Pages has *unlimited*
  bandwidth on the free plan; Netlify/Vercel/GitHub Pages allow ~100 GB of
  traffic per month — at 0.5 MB per visit that's roughly **200,000+ page
  views/month for $0** on any of them.
- The only paid-ish piece is optional everywhere: a form endpoint (free
  tiers on Formspree/Web3Forms/Basin) and CMS auth (free on Netlify
  Identity). Skip both and the operating cost stays exactly zero.

## 3. Set your domain

1. Point DNS at your host (they all have one-screen wizards).
2. Set **`url` in `src/config/site.ts`** to `https://your-domain.com`.
   That single value drives canonical tags, Open Graph URLs, `robots.txt` and
   the sitemap. Redeploy.

Verify after deploy:
- `https://your-domain.com/robots.txt` → plain text, contains your sitemap URL
- `https://your-domain.com/sitemap-index.xml` → lists the pages
- Share the URL in a chat → a real link preview card (og.png)

Submit the sitemap once in Google Search Console; done.

## 4. Contact form (no backend)

The form renders when `site.contact.formEndpoint` is set. All of these
accept a plain browser POST — take the endpoint URL and paste it in:

- **Formspree** — formspree.io → new form → copy `https://formspree.io/f/xxxx`
- **Web3Forms** — web3forms.com → access key → `https://api.web3forms.com/submit`
- **Basin**, **Getform**, or your own serverless function

The template POSTs `name`, `email`, `message` as form-data and toasts the
result. With no endpoint configured, the section shows the email call-to-action
only (and a note for you in place of the form).

## 5. GitHub heatmap

Set `site.githubUsername`. The calendar is fetched **at build time** from a
public GitHub-contributions mirror — visitors never hit the API, and deploys
refresh it. If the fetch fails (offline CI, rate limit), the build still
succeeds and shows clearly-labeled demo data. Rebuild daily/weekly if you
want the calendar fresh; any host's scheduled builds work (Netlify: "Build
hook" + cron; Vercel: cron-triggered deploy; Cloudflare: scheduled build).

## 6. Optional: CMS for non-technical editors

`public/admin/` ships a ready [Decap CMS](https://decapcms.org) setup that
edits the content collections through a web UI and commits to your repo
(every commit auto-deploys). It needs an identity layer:

- **Easiest with Netlify:** enable *Netlify Identity* in the dashboard
  (Site settings → Identity → Enable), invite editors by email, enable
  *Git Gateway* (Settings → Identity → Services). `/admin/` works immediately.
- **Any other host:** use an OAuth gateway (e.g. `decapbridge.com`) and set
  `backend.name: github` + `repo: you/your-repo` in `public/admin/config.yml`.
- **Local test:** `npx decap-server` in one terminal + set
  `local_backend: true` in `config.yml`.

Non-technical buyers can also edit everything without a CMS: GitHub's web
editor (pencil icon on any file) + auto-deploy is the zero-setup path.

## 7. Social preview image

`npm run og` writes a branded 1200×630 gradient to `public/og.png`. Replace
it with a designed card (your name, role, a screenshot) whenever you like —
it's referenced by `site.seo.ogImage` and both OG and Twitter tags.

## Pre-flight checklist

- [ ] `src/config/site.ts` — name, roles, tagline, email, socials, `url`
- [ ] `public/avatar.svg` replaced with your photo (square)
- [ ] `public/og.png` replaced (1200×630)
- [ ] Demo content removed — projects, experience, lab, facts, terminal script
- [ ] `robots.txt` + sitemap verified live
- [ ] Contact form tested (or endpoint left empty deliberately)
- [ ] Lighthouse pass (should be ~100s across the board)
