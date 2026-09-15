export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { insertMessage } from '../../lib/db';

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(5000),
  // honeypot: accepted here so bots get a success response; dropped below
  website: z.string().max(200).optional(),
  // ms since the form was rendered; real humans take > 3s
  elapsed: z.number().nonnegative().max(1000 * 60 * 60 * 24).optional(),
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// In-memory sliding-window rate limit (per server process). Enough to blunt
// scripted floods on a single-node deploy; move to Redis behind a balancer.
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  const limited = recent.length >= MAX_PER_WINDOW;
  recent.push(now);
  hits.set(ip, recent);
  return limited;
}

export const POST: APIRoute = async ({ request }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (rateLimited(ip)) {
    return json({ ok: false, error: 'Too many messages — try again later.' }, 429);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: 'Validation failed.',
        issues: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  }

  const { name, email, message, website, elapsed } = parsed.data;

  // Bot or scripted fill: pretend success, store nothing.
  if (website || (elapsed !== undefined && elapsed < 3000)) {
    return json({ ok: true });
  }

  insertMessage(name, email, message);
  return json({ ok: true });
};
