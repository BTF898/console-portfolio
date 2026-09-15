export const prerender = false;

import type { APIRoute } from 'astro';
import { SITE } from '../../config/site';
import { getExperience } from '../../lib/cv';
import { cvResponseSchema } from '@portfolio/cv-contract';

/** The full CV as JSON — the same data the /cv page renders. The response is
    validated against the shared @portfolio/cv-contract schema, so the API and
    its consumers can never drift apart silently. */
export const GET: APIRoute = async () => {
  const experience = (await getExperience()).map((entry) => ({
    company: entry.data.company,
    role: entry.data.role,
    start: entry.data.start,
    end: entry.data.end,
    location: entry.data.location ?? null,
    stack: entry.data.stack,
    highlights: entry.data.highlights,
  }));

  const body = {
    person: {
      name: SITE.name,
      role: SITE.role,
      location: SITE.location,
      email: SITE.email,
      url: SITE.url,
    },
    summary: SITE.summary,
    skills: SITE.skills.map((group) => ({
      group: group.group,
      items: [...group.items],
    })),
    education: SITE.education.map((e) => ({
      school: e.school,
      degree: e.degree,
      start: e.start,
      end: e.end,
      note: e.note,
    })),
    experience,
    generatedAt: new Date().toISOString(),
  };

  const parsed = cvResponseSchema.parse(body);

  return new Response(JSON.stringify(parsed, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
