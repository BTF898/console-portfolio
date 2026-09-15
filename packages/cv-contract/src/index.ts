import { z } from 'zod';

/* The contract for GET /api/cv.json (served by apps/atelier). The API route
   validates its response against this schema before sending; consumers can
   import the inferred types — or parse the fetch result — to stay in sync. */

export const cvHighlightSchema = z.object({
  text: z.string(),
  metric: z.string().optional(),
});

export const cvExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  start: z.string(),
  end: z.string().nullable(),
  location: z.string().nullable(),
  stack: z.array(z.string()),
  highlights: z.array(cvHighlightSchema),
});

export const cvSkillGroupSchema = z.object({
  group: z.string(),
  items: z.array(z.string()),
});

export const cvEducationSchema = z.object({
  school: z.string(),
  degree: z.string(),
  start: z.string(),
  end: z.string(),
  note: z.string(),
});

export const cvPersonSchema = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string(),
  email: z.string(),
  url: z.string(),
});

export const cvResponseSchema = z.object({
  person: cvPersonSchema,
  summary: z.string(),
  skills: z.array(cvSkillGroupSchema),
  education: z.array(cvEducationSchema),
  experience: z.array(cvExperienceSchema),
  generatedAt: z.string(),
});

export type CvHighlight = z.infer<typeof cvHighlightSchema>;
export type CvExperience = z.infer<typeof cvExperienceSchema>;
export type CvSkillGroup = z.infer<typeof cvSkillGroupSchema>;
export type CvEducation = z.infer<typeof cvEducationSchema>;
export type CvPerson = z.infer<typeof cvPersonSchema>;
export type CvResponse = z.infer<typeof cvResponseSchema>;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** '2022-03' → 'Mar 2022' */
export function formatMonth(value: string): string {
  const [y, m] = value.split('-');
  const idx = Number(m) - 1;
  return `${MONTHS[idx] ?? m} ${y}`;
}

/** '2022-03' + null → 'Mar 2022 — Present' */
export function formatRange(start: string, end: string | null | undefined): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
}
