# Selling this template

Notes for turning the repo into a product. Practical, not legal advice —
have a real license/EULA reviewed before selling.

## Provenance (read first)

This codebase is an **original implementation** of design patterns documented
in `DESIGN-ANALYSIS.md` (which analyzes amantiwari.co.in's *ideas*: console
aesthetic, terminal, palette, heatmap). The analyzed site's code, content and
branding are **not** open-source licensed — this repo deliberately contains
none of it: no copied CSS/JS, no cloned pixel-level identity, fictional demo
persona, original copy. Keep it that way:

- ✅ sell/modify this code, market it as "engineer-console style portfolio"
- ❌ don't copy the analyzed site's actual code, text, name, avatar or
  project content into the product or its marketing
- 💡 if you ever want the *exact* design instead, license it from its author

## Product shapes that work

1. **Paid template** (Gumroad / Lemon Squeezy)
   - Zip the repo (without `node_modules`, `dist`, `.astro`).
   - License tiers: *Personal* (one site, own use) vs *Studio* (client work,
     unlimited sites). State redistribution rights explicitly.
   - Include the docs folder in the zip — it's the product.

2. **Open-core**
   - This repo public under MIT (keep the LICENSE note removed before
     publishing if you prefer a clean file) as marketing.
   - Sell "Pro": extra theme presets, per-project case-study pages, blog,
     priority support, updates.

3. **Marketplace** (ThemeForest etc.) — bigger reach, review process +
   revenue share; their docs requirements are stricter than what ships here.

## What actually sells it

- The **live demo** IS the product page: link the deployed demo (Sam Rivera
  persona) and this repo's screenshots.
- Lead with the three buyer pains this solves: *deploy in minutes*, *edit
  without code (site.ts + CMS)*, *SEO/fast by construction (real HTML, ~20 KB
  JS)*.
- The **exploration achievements** are the unique hook no competitor template
  has: visitors unlock console-flavored badges for actually reading the page
  (open the palette, toggle the theme, find the Konami code…), with a
  progress meter in the footer. It's a genuine engagement differentiator to
  name in the product listing — and one switch (`features.achievements`)
  turns it off for buyers who don't want it.
- "$0 to run" is a second listing headline: ~0.5 MB of static files, no
  backend, no API keys — free hosting tiers cover ~200k page views/month.
- One-click demo buttons: add "Deploy to Netlify / Vercel" buttons in the
  README of the public demo repo — they convert.

## Support is the real cost

Non-technical buyers generate tickets. Protect your margin:

- The docs folder answers 90% of questions — point to it first.
- Build-time schema validation turns "my site is broken" into a readable
  error message with the file and field named. Don't weaken the schemas.
- Version the product (v1.1.0 in package.json) and keep a CHANGELOG; ship
  fixes as tagged releases so buyers can pull them.

## Roadmap ideas (in value order)

1. Per-project case-study pages (strongest hiring signal, high perceived value)
2. Blog with RSS
3. 2–3 more theme presets (instant variety for screenshots)
4. Auto-OG-image generation at build (satori) instead of the static file
5. i18n (hreflang + per-locale content folders) — only if buyers ask
