export const prerender = false;

import type { APIRoute } from 'astro';
import { SITE } from '../../config/site';
import { getExperience } from '../../lib/cv';

/** The full CV as JSON — the same data the /cv page renders. */
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

  return new Response(
    JSON.stringify(
      {
        person: {
          name: SITE.name,
          role: SITE.role,
          location: SITE.location,
          email: SITE.email,
          url: SITE.url,
        },
        summary: SITE.summary,
        skills: SITE.skills,
        education: SITE.education,
        experience,
        generatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    { headers: { 'content-type': 'application/json; charset=utf-8' } },
  );
};
