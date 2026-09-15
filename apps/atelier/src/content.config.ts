import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Work history. Each file is one role, with accomplishment-focused
// highlights. `metric` is the number that proves the bullet — it gets a
// visual chip on the site and its own field in /api/cv.json.
const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string().max(120),
    role: z.string().max(120),
    start: z.string().regex(/^\d{4}-\d{2}$/, 'use YYYY-MM, e.g. 2022-03'),
    end: z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .nullable(),
    location: z.string().max(120).optional(),
    stack: z.array(z.string().max(40)).default([]),
    highlights: z
      .array(
        z.object({
          text: z.string().min(1).max(400),
          metric: z.string().max(60).optional(),
        }),
      )
      .min(1),
    order: z.number().default(99),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().max(120),
    tagline: z.string().max(80),
    summary: z.string().max(600),
    year: z.number().int().min(2000).max(2100),
    stack: z.array(z.string().max(40)).default([]),
    metrics: z
      .array(z.object({ value: z.string().max(20), label: z.string().max(60) }))
      .max(4)
      .default([]),
    links: z
      .object({
        live: z.string().url().optional(),
        repo: z.string().url().optional(),
      })
      .default({}),
    order: z.number().default(99),
  }),
});

export const collections = { experience, projects };
