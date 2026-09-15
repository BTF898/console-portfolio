export const prerender = false;

import type { APIRoute } from 'astro';
import { z } from 'zod';
import { setMessageRead, deleteMessage } from '../../../lib/db';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

const patchSchema = z.object({ read: z.boolean() });

/** Mark a message read/unread. */
export const PATCH: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ error: 'Bad id' }, 400);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return json({ error: 'Expected { read: boolean }' }, 400);

  const changed = setMessageRead(id, parsed.data.read);
  if (!changed) return json({ error: 'Not found' }, 404);
  return json({ ok: true });
};

/** Delete a message. */
export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return json({ error: 'Bad id' }, 400);
  const removed = deleteMessage(id);
  if (!removed) return json({ error: 'Not found' }, 404);
  return json({ ok: true });
};
