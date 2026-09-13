# Content guide

Everything on the page that isn't "who you are" (that's `site.ts`) lives in
`src/content/`. Each folder is a **collection** with a schema — edit files in
any text editor, or through GitHub's web editor, or through the CMS
(see deployment.md). A build fails loudly if a file is malformed, so broken
content can never ship.

You do **not** need to restart the dev server when adding files.

---

## Projects — `src/content/projects/*.mdx`

One file per project. `featured: true` puts it in the big "Selected projects"
section (with the animated diagram); everything else lands in the
"Other things" grid. Sort with `order` (lower first).

```yaml
---
title: Relay
tagline: Realtime event infrastructure   # kicker above the title
summary: >                                # one paragraph
  A push-first event relay that…
year: 2025
featured: true
order: 1
stack: [Go, NATS, Raft]                   # chips under the summary
metrics:                                  # big numbers (max 4)
  - { value: 99.98%, label: 'uptime (12 mo)' }
points:                                   # ▸ bullet list
  - Survives node loss via a Raft-replicated log
links:
  live: https://example.com               # optional
  repo: https://github.com/you/relay      # optional
diagram: { … }                            # optional, featured projects only
---
Everything below the frontmatter is markdown (currently shown as a note;
use it for case-study copy when you add per-project pages — see "Expanding").
```

Both files in `links` are optional; buttons render only when present.

### Diagrams

Featured projects can render an **animated architecture diagram** from data.
Nodes sit on a grid (`col` 0–5 × `row` 0–3), edges connect node ids, `hot`
highlights the "money" node:

```yaml
diagram:
  caption: 'relay — fan-out topology'
  hot: broker
  nodes:
    - { id: web,    label: web / mobile,  sub: sse clients,    col: 0, row: 0 }
    - { id: broker, label: relay broker,  sub: fan-out core,   col: 2, row: 0 }
  edges: [[web, broker]]
```

Rules of thumb: 4–6 nodes, short labels (≤14 chars), `sub` optional.
The rendering is pure SVG + CSS (draw-in on scroll, flowing dashed edges) —
no runtime cost. Skip `diagram` and the visual column simply doesn't render.

---

## Experience — `src/content/experience/*.md`

One file per role. The body is free markdown; `p` becomes the context line,
`li` items become the timeline bullets, `**bold**` gets the metric styling.

```yaml
---
company: Northwind Labs
role: Senior Software Engineer
start: '2022-03'        # YYYY-MM, quoted!
end: null               # null = "Present", or '2024-02'
order: 1                # lower = higher on the timeline
---
One paragraph of context.

- Led the rewrite that cut p95 from 400 ms to **87 ms**
- Mentored two engineers to independent on-call
```

Durations ("4 yr 6 mo") are computed automatically — never type them.

---

## Lab — `src/content/lab/*.md`

Small experiments. `glyph` picks the animated thumbnail: `spin`, `pulse`,
`scan`, `draw` or `blink`.

```yaml
---
name: bench-kit
note: load-test harness with recording playback
glyph: draw
link: https://github.com/you/bench-kit   # optional; omit for a plain card
order: 1
---
```

The search box filters cards by name + note text — it just works.

---

## Expanding later

The architecture is designed for growth. Recipes:

**Add a blog** (an afternoon):
1. New collection in `src/content.config.ts` — copy the `lab` pattern, add
   `pubDate` and `description` to the schema.
2. `src/content/posts/*.mdx` files.
3. `src/pages/blog/index.astro` listing `getCollection('posts')` sorted by
   date, and `src/pages/blog/[...slug].astro` rendering with `render(entry)`.
4. The sitemap picks the new routes up automatically.

**Per-project case-study pages**: create `src/pages/work/[...slug].astro`,
render each project's markdown body, and link the card titles to
`/work/${project.id}`. The homepage stays fast; the depth moves a click away.

**New sections**: copy any component in `src/components/` (Lab.astro is the
simplest), add it to `src/pages/index.astro`, add a nav link in `Nav.astro`.
Reuse the tokens and `data-reveal` and it will look native.

**Auto-list your repos**: `fetch` the GitHub API in a component's frontmatter
(like GithubCard does) and map the results to cards.
