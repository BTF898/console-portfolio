# Theming guide

The whole look is driven by **CSS custom properties** in one file:
`src/styles/tokens.css`. Components never hard-code colors — change a token,
everything follows, in both modes, forever.

## Switching presets

Two presets ship: `forest` (green paper + periwinkle) and `midnight`
(slate paper + cyan). Pick in `src/config/site.ts`:

```ts
theme: { preset: 'midnight', mode: 'light' },
```

`mode` is only the *default* — visitors toggle dark/light themselves and the
choice is remembered (`localStorage`, restored before first paint, no flash).

## Anatomy of a token set

Each preset defines two blocks in `tokens.css`:

- dark values on `:root[data-preset='…']`
- light overrides on `:root[data-preset='…'][data-mode='light']`

The token groups, in the order you should touch them:

| Group | Tokens | Notes |
|---|---|---|
| Surfaces | `--bg`, `--bg-raised`, `--surface`, `--surface-2`, `--surface-3` | A 5-step ladder from page to chip. Keep the steps subtle. |
| Lines | `--line`, `--line-strong`, `--grid`, `--grid-fine` | Hairlines are alpha colors over the surface color. |
| Ink | `--text`, `--text-2`, `--text-3` | Three-step text ladder. Check contrast for `--text-3` (AA 4.5:1). |
| Accent | `--accent`, `--accent-strong`, `--accent-contrast`, `--accent-soft`, `--accent-glow` | One hue family; `--accent-contrast` must read on `--accent-strong`. |
| Semantic | `--live`, `--danger` | Status green + error red. |
| Elevation | `--float-shadow`, `--btn-shadow` | `--btn-shadow` is tinted with the accent on purpose. |
| Shape & motion | `--r-sm/md/lg/pill`, `--ease-out`, `--speed` | Small radii keep the instrument feel; don't inflate them. |
| Layout | `--container`, `--gutter`, `--section-y`, `--nav-h` | Fluid via `clamp()`; rarely need changes. |

The blueprint grid texture is built from `--grid` / `--grid-fine` in
`base.css` (`body { background-image: var(--bg-texture) }`) — set both to
`transparent` for a flat background.

## Creating a third preset

1. Copy the `midnight` blocks in `tokens.css`, rename the selector value
   (e.g. `[data-preset='ember']`) and swap the hue families.
2. Add the preset id to the type in `src/config/site.ts`
   (`preset: 'ember' as 'forest' | 'midnight' | 'ember'`).
3. Done — the toggle, heatmap colors (`--gh-*` derive from `--live`), diagrams
   and every component pick it up automatically.

The GitHub heatmap intensity scale is derived at runtime:

```css
--gh-1: color-mix(in srgb, var(--live) 25%, var(--surface-2));
```

…so any `--live` color produces a coherent scale.

## Typography

`--font-sans` / `--font-mono` load self-hosted variable fonts (Recursive,
JetBrains Mono) via Fontsource — no CDN, no layout shift. To change fonts:

```bash
npm install @fontsource-variable/inter
```

…then swap the import in `src/layouts/Base.astro` and the `--font-*` values
in `tokens.css`. Display sizes and tracking live in `.hero-name` /
`.section-title` rules and the `--display-*` tokens.

## Motion

The house easing is `--ease-out: cubic-bezier(.16,1,.3,1)` (expo-out). All
components and islands use it. Scroll reveals are `data-reveal` attributes
(`up | left | right | scale`) with optional `data-reveal-delay="0..7"` for
staggering — no JavaScript knowledge needed to choreograph a section.

Every animation respects `prefers-reduced-motion` (global freeze + per-
component graceful fallbacks like the marquee reflowing to a wrapped row).
If you add animations, keep that contract: **decorative motion must degrade,
content must never hide behind it.**
