export const prerender = false;

import type { APIRoute } from 'astro';
import { listMessages } from '../../../lib/db';

/** List contact messages (newest first). Bearer-token protected in middleware. */
export const GET: APIRoute = async ({ url }) => {
  const unreadOnly = url.searchParams.get('unread') === '1';
  let messages = listMessages();
  if (unreadOnly) messages = messages.filter((m) => !m.read);
  return new Response(JSON.stringify({ count: messages.length, messages }), {
    headers: { 'content-type': 'application/json' },
  });
};
