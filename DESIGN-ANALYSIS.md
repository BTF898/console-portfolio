# Design Analysis — amantiwari.co.in

> A design-system and interaction teardown of [amantiwari.co.in](https://amantiwari.co.in/) — the portfolio of **Aman Tiwari, Full Stack Software Engineer | Applied AI** (Bengaluru).
>
> **Method:** analysis of the served HTML document, the full production CSS bundle (`/assets/index-ZcbWiRFt.css`, 65 KB), and the rendered page content. All tokens, values, and component names below are extracted verbatim from the shipped code, not inferred from screenshots.

---

## 1. Site overview

| Aspect | Finding |
|---|---|
| Purpose | Personal portfolio / résumé site for a full-stack + Applied AI engineer |
| Positioning | "Production systems in Node.js, TypeScript and Go, and the Applied AI that runs on them" — multi-agent LLM workflows, RAG, vector search |
| Architecture | Client-rendered **React SPA** built with **Vite**; body is a single `<div id="root">`, all content ships in one JS bundle |
| Styling | Hand-written design-system CSS (compiled by **Lightning CSS** — visible from `--lightningcss-*` vars and `-webkit-` prefixes), no CSS-in-JS or utility framework |
| Theming | Two full themes (dark default, light) driven by `data-theme` on `<html>`, persisted in `localStorage` under key `theme` |
| Identity signals | `theme-color: #0f1a14`, SVG favicon, OG title/description, `lang="en"` |

The site reads less like a template portfolio and more like a **"systems engineer's console"**: terminal windows, live status dots, GitHub heatmaps, animated architecture diagrams, and a ⌘K command palette. The visual identity is *dark forest-green paper with blueprint gridlines and a periwinkle-blue accent*.

---

## 2. Design tokens

### 2.1 Color — dark theme (default)

Green-tinted near-black backgrounds, layered through a surface ladder; text is a mint-white ladder; one blue accent family plus semantic green/red.

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0f1a14` | Page background (deep green-black) |
| `--bg-raised` | `#122019` | Raised page areas |
| `--surface` | `#16261d` | Card surface |
| `--surface-2` | `#1c2f24` | Card surface, hover level |
| `--surface-3` | `#24392c` | Highest surface (nav pill, chips) |
| `--line` | `#aadcb41c` | Hairline borders (green @ 11% alpha) |
| `--line-strong` | `#aadcb438` | Emphasized borders (green @ 22%) |
| `--text` | `#e4f0e6` | Primary ink (mint white) |
| `--text-2` | `#adc6b3` | Secondary text |
| `--text-3` | `#89a491` | Muted/caption text |
| `--accent` | `#9ab9ff` | Periwinkle accent (links, highlights) |
| `--accent-strong` | `#3f6be0` | Saturated blue (primary buttons, fills) |
| `--accent-contrast` | `#fff` | Text on accent |
| `--accent-soft` | `#9ab9ff1f` | Accent tint fill (12%) |
| `--accent-glow` | `#78a0ff12` | Ambient glow (7%) |
| `--halo` | `#3f6be0` | Halo/glow source color |
| `--live` | `#7fd99a` | "Live/online" status green |
| `--danger` | `#ff9a8f` | Error/danger salmon |

### 2.2 Color — light theme

Same structure, swapped to a warm sage "paper" palette with a deeper royal-blue accent:

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#0f1a14` | `#e5eedf` |
| `--surface` | `#16261d` | `#f4f8f1` |
| `--surface-3` | `#24392c` | `#d0dfc8` |
| `--text` | `#e4f0e6` | `#15231a` |
| `--accent` | `#9ab9ff` | `#1f47b0` |
| `--accent-strong` | `#3f6be0` | `#1f47b0` |
| `--live` | `#7fd99a` | `#1c7a3e` |
| `--danger` | `#ff9a8f` | `#b3261e` |

### 2.3 Signature background texture

Both themes paint a **blueprint grid** on the page background via four stacked `linear-gradient` layers (`--bg-texture`, sized `--bg-texture-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px`):

- Two 1px lines at 100px spacing (coarse grid) + two at 20px spacing (fine grid)
- Dark theme lines: green at 7–12% alpha (`#aadcb408` / `#aadcb412`)
- Light theme lines: green at 10–20% alpha (`#3c8c5a1a` / `#3c8c5a33`)

This dual-scale grid is the site's most distinctive ambient visual.

### 2.4 Shadows & glows

| Token | Value | Use |
|---|---|---|
| `--float-shadow` | `0 24px 60px -20px #0009, 0 2px 8px #0000004d` | Floating panels/terminal |
| `--btn-shadow` | `0 10px 24px -14px #3f6be0cc` | Primary button glow (accent-colored shadow) |
| `--btn-ghost-shadow` | `none` | Ghost buttons stay flat |
| `--card-shadow` | `none` | Cards rely on 1px borders, not shadows |
| Hero avatar | `0 18px 40px -20px` accent-strong glow | Accent-haloed avatar frame |

### 2.5 Shape & geometry

| Token | Value |
|---|---|
| `--radius-sm` / `--radius` / `--radius-lg` | `4px` / `6px` / `8px` |
| `--radius-pill` | **`6px`** — deliberately *not* fully rounded; buttons use it, so the whole UI stays crisp and slightly squared |
| `--avatar-radius` / inner | `8px` / `6px` (double-frame effect via 4px padding) |
| `--bw` (border width) | `1px` everywhere |

### 2.6 Typography

| Token | Value |
|---|---|
| `--font-sans` / `--font-display` | **Recursive Variable** (self-hosted, weight axis 300–1000, `CASL 1` on display — the "casual" axis of Recursive), fallback `ui-sans-serif, system-ui, sans-serif` |
| `--font-mono` | **JetBrains Mono Variable**, fallback `ui-monospace, SFMono-Regular, Menlo, monospace` |
| `--hero-weight` / `--hero-track` | `760` / `-.035em` |
| `--title-weight` / `--title-track` | `720` / `-.03em` |
| `--head-weight` | `680` |

Key sizes:

- **Hero name:** `clamp(3.3rem, 8.2vw, 6rem)`, line-height `.98`
- **Section titles:** `clamp(2.25rem, 4.8vw, 3.6rem)` → `clamp(2.6rem, 6vw, 4.5rem)` on wide screens
- Terminal/code/labels/metrics: mono, ~`.8rem`, line-height `1.65`
- `.tnum` utility for tabular numerals (metrics, dates)

Both fonts ship **inline as base64 woff2** in the CSS (`font-display: swap`) — zero font network requests, no FOUT beyond swap semantics.

### 2.7 Layout, spacing, motion primitives

| Token | Value | Notes |
|---|---|---|
| `--container` | `1200px` (→ `1320px` at wide breakpoint) | `.container` = `min(100% − 2·gutter, container)`, centered |
| `--gutter` | `clamp(1.25rem, 4vw, 2.5rem)` | Side padding |
| `--section-y` | `clamp(5.5rem, 11vw, 9rem)` | Vertical section rhythm |
| `--nav-h` | `68px` | Fixed header height |
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Expo-out — the house easing for *all* transitions |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` | Symmetric easing |

---

## 3. Global layout & navigation

- **Fixed header** (`.nav`, z-50, 68px): transparent with an invisible bottom border that fades in on scroll (`.is-scrolled` state, `.4s` background/border transition).
- **Nav pill**: the whole nav row sits on a raised "pill" surface (`.nav-pill` — `surface-3` bg + strong hairline) that floats over the grid-textured page.
- **Contents:** logo (mark + name), anchor links with per-link labels, a **⌘K command trigger** (`.nav-cmd` with kbd hint), and a primary CTA button. A **mobile menu button** swaps to a full-screen `.mobile-menu` (nav, socials, email, footer rows).
- **Scroll progress:** 2px accent bar pinned to the nav's bottom edge (`.nav-progress`, `transform-origin: 0` scaleX).
- **Skip link** (`sr-only`-style, first focusable) for keyboard users.
- **Footer** (`.site-footer`): inner row with left brand/legal and `.footer-right` (incl. a `.to-top` control).

---

## 4. Section-by-section anatomy

The page is one long scroll of `.section`s (padding-block `--section-y`), each opened by a `.section-head` (title + `.section-lede`).

### 4.1 Hero
- Full viewport (`min-height: 100svh`), flex-centered, two-column grid `1.1fr / 0.9fr` (→ 1 column ≤ mobile).
- Left column: `.hero-hello` row (small square **avatar**, 68–88px, 8px radius, accent glow, 4px padded double frame + greeting text), the **name** rendered word-by-word (`.hero-name-word` inside `.word-mask` spans — masked word-reveal animation), a **rotating role line** (`.rotator` / `.rotator-word` cycling titles with separators), summary paragraph, meta row, CTA pair (`.btn--primary` + `.btn--ghost`), social row, and a **live status pill** (`.status--live` with pulsing `.live-dot`).
- Right column: a **console/terminal card** (see 4.2).
- Bottom center: animated **scroll cue** (`.hero-scroll` with a line keyframe; hidden on short/mobile viewports).
- Ambient `hero-grid`/`hero-field` decorative layers; overflow clipped.

### 4.2 Interactive terminal
A fake CLI console (`.term` + `.console` chrome: bar, traffic-light `.console-dots`, title, badge):
- `.t-tabs` — tab strip including an **auto-playing tab** (`is-auto`, animated indicator).
- `.t-screen` — scrollable output area (`container-type: inline-size` — container queries adapt its type scale), lines composed of mono primitives: `.t-prompt`, `.t-user`, `.t-path`, `.t-cmd`, `.t-val`, `.t-out`, `.t-key`, `.t-link`, `.t-dim`, `.t-head`, `.t-sigil`.
- Typed-command simulation with **caret blink** (`t-blink`) and per-character **dwell** timing (`t-dwell`) — reads like someone is live-typing résumé facts (`whoami`-style).

### 4.3 Tech marquee
- `.marquee` bands with `mask-image` fade at both edges (transparent 0–9%, solid 9–91%, fade out).
- `.marquee-track`: infinite linear scroll, **52s** forward / **58s** reverse on the alternating band; `.marquee-item` chips = skill chips (`skill-chip`, `tag`).
- Pauses on hover (`animation-play-state: paused` under `hover:hover`).

### 4.4 About
Two-column grid `1.25fr / 0.85fr`: narrative paragraphs (`.about-text`, `.about-p`) on the left; an **ID-card** on the right — `.about-card` with avatar, name, title, and a **facts definition list** (`.about-facts` / `.about-dl`: label/value pairs like location, focus, availability).

### 4.5 Capability bento
`.bento` — three equal panels (3 → 2 → 1 columns responsive): `.panel--ai`, `--cloud`, `--practices`, each with icon, title, blurb. Domains: Applied AI / LLM systems, cloud & infrastructure, engineering practices.

### 4.6 Featured projects + animated architecture diagrams
- `.feats` list; each `.feat` alternates direction (`.feat--flip`), pairing `.feat-visual` with `.feat-body` (tagline, title, summary, bullet points, **metric strip** `.feat-metrics`, tech-stack chips, year, links incl. `.proj-link--live`).
- The visual side is an **animated SVG system diagram** (`.diagram` with scrollable wrapper, caption, hint): `.node`/`.node-box`/`.node-label`/`.node-sub` boxes joined by `.edge`s with dots and labels, plus a `.g-*` primitive kit (`g-box`, `g-line`, `g-dash`, `g-dot`, `g-ring`, `g-on`, `g-hot`, `g-hot-line`) animated by the `lab-*`/`a-*` keyframes (draw-on strokes, flowing dashes, pulsing hot paths, spinning rings). Diagrams are hand-built architecture illustrations of each project.

### 4.7 Live GitHub card
`.gh-card` — a "live" integration block:
- Header: user handle + arrow; **stat row** (`.gh-stats`).
- **Contribution heatmap**: CSS grid `--weeks` columns × 7 rows, auto-flow column (`.gh-grid`, `.gh-cell`); cells stagger-scale in (`gh-today` keyframe + per-cell delay), `.is-today` ring highlight, future cells dimmed.
- Ring gauges (`.gh-ring`, `ring-spin`) + month/weekday axes and a legend (`.gh-months`, `.gh-weekdays`, `.gh-legend`, `.gh-key`, `.gh-seg`), tooltip (`.gh-tip`), footer.

### 4.8 AI request-flow visualization
`.fr-tile` — animated pipeline strip: header with brand + live counter (`.fr-count`), lanes (`.fr-lane`) with rails/tracks (`.fr-rail`, `.fr-track`, `.fr-fill`), nodes (`.fr-nodes`/`.fr-node`) and **traveling packets** (`.fr-packet`), with `fr-ping`/`fr-note` animations — a packet-flow metaphor for an LLM request moving through agents/tools.

### 4.9 Lab (experiments index)
- Searchable grid: `.lab-search` input (live filter, `.is-match` state, `.lab-count`), `.lab-grid` of `.lab-item` cards, each with a **pure-CSS animated glyph** (`.lab-glyph` using the `a-*` primitive classes — spin, scan, draw, grow, pulse…), name, note, arrow.
- `.lab-empty` state for no matches.

### 4.10 Experience timeline
- `.xp-wrap` vertical list; a 2px **rail** on the left (`.xp-rail`) with a **scroll-driven fill** (`.xp-rail-fill`) and per-entry nodes (`.xp-node`).
- Cards (`.xp-card`): title, company, date range + computed duration (`.xp-dur`, tabular nums), context line, bullet `.xp-point`s with metric highlights (`.xp-metric`), optional "more" expander.

### 4.11 More projects
`.more-grid` (3 → 2 columns) of compact `.card`s: top row, title, summary, tech `.card-stack`, links row; includes `.copy-btn` (clipboard + toast).

### 4.12 Contact
Two-column grid `1.1fr / 0.9fr`: left = big email link (`.contact-email`) + CTA row + socials; right = **compose form** (`.compose`): fields with floating labels (`.field`, `--field-ink`/`--field-accent` rgb channel tokens, `field-in` keyframe), validation error slot, submit button.

### 4.13 Utility & overlay components
- **⌘K command palette**: `.cmdk-overlay` (fixed, `backdrop-filter: blur(4px)`, `#04050999` dark / `bg` @30% light, content starts at `12vh`) → `.cmdk` panel with input, grouped `.cmdk-list` (`.cmdk-group`, `.cmdk-label`, `.cmdk-item`, `.cmdk-icon`), empty state, footer hints (`.cmdk-hint`, `.cmdk-enter` with `kbd` chips).
- **Toast system**: `.toast-region` / `.toast` (feedback for copy actions, form submit).
- **Magnetic buttons**: `.magnetic` (transform follows cursor, `.6s` expo-out release, `will-change: transform`).
- **Spotlight cards**: `.spot` (isolation context for a cursor-tracked glow).
- `.kbd` keycap chips, `.mono`, `.tag`, `.chips`, `.accent`, `.subhead`, `.tnum` helpers.

---

## 5. Motion & interaction catalog

### 5.1 Keyframes (all 20 defined in the bundle)

| Keyframe | Drives |
|---|---|
| `marquee` | Infinite tech-chip ticker (52s / 58s reverse) |
| `t-blink`, `t-dwell` | Terminal caret blink; typed-character pacing |
| `theme-reveal` | **Circular wipe transition** when toggling dark/light |
| `scroll-cue` | Hero scroll-indicator line |
| `live-pulse` | "Available" status dot |
| `field-in` | Contact-field entrance |
| `gh-today` | Heatmap cell stagger-in; today ring |
| `ring-spin` | GitHub gauge rings |
| `fr-note`, `fr-ping` | AI flow lane annotations; packet pings |
| `lab-blink`, `lab-draw`, `lab-drop`, `lab-flow`, `lab-grow`, `lab-lift`, `lab-pulse`, `lab-rr`, `lab-scan`, `lab-slide`, `lab-spin` | Lab glyph + architecture-diagram animation kit |

### 5.2 Scroll-reveal primitives
A generic `a-*` class kit (`a-slide`, `a-lift`, `a-grow`, `a-drop`, `a-draw`, `a-scan`, `a-flow`, `a-pulse`, `a-rr`, `a-spin`, `a-blink`) is applied declaratively to elements and triggered by an `.is-in` state (IntersectionObserver) — so diagrams and glyphs animate *on scroll into view*, with staggered children. Diverse state classes (`is-active`, `is-current`, `is-lit`, `is-on`, `is-done`, `is-idle`, `is-flipped`, `is-dim`) drive hover/active/diagram states.

### 5.3 Signature interactions
1. **⌘K palette** with keyboard nav — SPA-wide command launcher (navigate sections, copy email, toggle theme…).
2. **Self-typing terminal** with tabs and live output.
3. **Theme toggle** with circular reveal wipe + `localStorage` persistence.
4. **Live-feel data**: pulsing status dot, GitHub heatmap, animated counters/packets.
5. **Magnetic hover** on primary CTAs; **spotlight** glow tracking on cards; marquee pause-on-hover.
6. **Scroll progress** bar in the nav; scroll-filled experience rail; smooth scroll (`scroll-behavior`).

### 5.4 Reduced-motion behavior
`prefers-reduced-motion: reduce` disables or degrades each animated system explicitly: `html{scroll-behavior:auto}`, heatmap cells render statically (no stagger), terminal caret stops blinking, hero avatar halo animation off, **lab glyphs freeze**, the marquee **reflows to a wrapped static row** instead of scrolling, and flow fills/packets lose transitions. This is a per-component, opt-down design — not a blanket kill.

---

## 6. Responsive strategy

| Query | Effect |
|---|---|
| `width ≤ 1080px` / `≤ 1024px` | Grids compress (hero, about, contact → narrower gutters), bento 3→2 cols, more-grid 3→2, section titles scale up slightly |
| `width ≤ 1000px` | Mobile regime: hero/about/contact grids → 1 column, bento → 1, **mobile menu replaces nav links**, hero `min-height: auto`, scroll cue hidden, avatar 64px |
| `height ≤ 740px` / `≤ 560px`, `height ≤ 520px + landscape` | Short-viewport compaction (hero paddings, scroll cue) |
| `hover: none` / `pointer: coarse` | Touch adjustments (marquee hover-pause and hover-only affordances removed) |
| `prefers-reduced-motion` | See 5.4 |

Also notable: **container queries** (`container-type: inline-size` on the terminal) so components adapt to their slot, not just the viewport; fluid `clamp()` everywhere instead of discrete steps.

---

## 7. Accessibility & performance details

- **A11y:** skip link, `sr-only` utility, semantic nav/footer, visible `:focus` handling via kbd-friendly palette, `color-scheme` declared per theme (correct native form/scrollbar rendering), full reduced-motion coverage.
- **Perf:** zero web-font requests (fonts inlined as base64 woff2 in the CSS); single JS bundle + single CSS file (Vite hashing, `crossorigin`); CSS-only animations (no JS animation loop for ambient motion); Lightning CSS minification.
- **Theming correctness:** inline `<script>` in `<head>` reads `localStorage.theme` *before first paint* — eliminates theme flash; `data-theme` drives all tokens via CSS custom properties.
- **SEO:** descriptive title, meta description, OG tags; SPA caveat — content is client-rendered, so there is no static HTML content for crawlers that don't execute JS.

---

## 8. Takeaways — what makes this design work

1. **One idea, everywhere:** "engineer's console" — terminal, grid paper, mono labels, live dots, diagrams. Every section reinforces it; nothing is generic template furniture.
2. **Disciplined token system:** a strict surface ladder (bg → raised → surface 1-2-3), a 3-step text ladder, one accent family, 1px hairlines, and *small* radii (4/6/8px, "pill" = 6px) give it a precise, instrument-like feel.
3. **Dual-scale texture:** the 20px + 100px blueprint grid is cheap to render and instantly recognizable.
4. **Motion as information:** animations aren't decoration — the terminal *tells* the résumé, diagrams *explain* architectures, packets *show* dataflow, the heatmap *proves* activity. All of it degrades gracefully under reduced motion.
5. **Component-level responsiveness** (container queries) and fluid `clamp()` sizing keep the layout stable from phones to ultrawide without breakpoint sprawl.
6. **Craft details:** tabular numerals for metrics, per-theme shadows, accent-colored button glow, word-mask name reveal, magnetic CTAs, ⌘K palette — small touches that compound into a premium feel.
