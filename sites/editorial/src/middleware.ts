import { defineMiddleware } from 'astro:middleware';
import { timingSafeEqual } from 'node:crypto';

function tokenEquals(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// Bearer-token gate for the inbox API. The admin page itself is static and
// holds the token client-side (sessionStorage); this is the real boundary.
export const onRequest = defineMiddleware((context, next) => {
  if (context.url.pathname.startsWith('/api/inbox')) {
    const expected = process.env.ADMIN_TOKEN;
    if (!expected || expected === 'change-me-to-a-long-random-string') {
      return json({ error: 'ADMIN_TOKEN is not configured on the server.' }, 503);
    }
    const provided = context.request.headers
      .get('authorization')
      ?.replace(/^Bearer\s+/i, '');
    if (!provided || !tokenEquals(provided, expected)) {
      return json({ error: 'Unauthorized' }, 401);
    }
  }
  return next();
});
