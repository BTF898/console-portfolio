import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ==========================================================================
   Content collections — the template's "CMS".
   Every file in these folders becomes site content; the schemas below
   validate them at build time with human-readable errors, so a typo can
   never ship a broken page. See docs/content.md for the field reference.
   ========================================================================== */

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(), // short kicker above the title, e.g. "REALTIME INFRA"
    summary: z.string(), // one paragraph
    year: z.number().int(),
    stack: z.array(z.string()).default([]),
    metrics: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .max(4)
      .default([]),
    points: z.array(z.string()).default([]),
    links: z
      .object({
        live: z.string().url().optional(),
        repo: z.string().url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false), // featured = big section w/ diagram
    order: z.number().default(99),
    /* Diagram nodes are placed on a grid; edges connect node ids.
       Only used for featured projects. See docs/content.md#diagrams. */
    diagram: z
      .object({
        caption: z.string().default(''),
        hot: z.string().optional(), // id of the highlighted node
        nodes: z.array(
          z.object({
            id: z.string(),
            label: z.string(),
            sub: z.string().optional(),
            col: z.number().int().min(0).max(5),
            row: z.number().int().min(0).max(3),
          }),
        ),
        edges: z.array(z.tuple([z.string(), z.string()])),
      })
      .optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: z.string(), // e.g. "2022-03" — displayed as given
    end: z.string().nullable(), // null = present
    order: z.number().default(99), // lower = first on the timeline
  }),
});

const lab = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lab' }),
  schema: z.object({
    name: z.string(),
    note: z.string(), // one short line
    glyph: z.enum(['spin', 'pulse', 'scan', 'draw', 'blink']).default('pulse'),
    link: z.string().url().optional(), // omit for a static card
    order: z.number().default(99),
  }),
});

export const collections = { projects, experience, lab };
