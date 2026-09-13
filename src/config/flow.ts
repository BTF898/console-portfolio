/* ==========================================================================
   flow.ts — the animated pipeline strip ("live" request flow).
   Each lane is a labeled rail with stages; packets travel left → right.
   Pure CSS animation, zero runtime. Demo content — make it yours.
   ========================================================================== */

export const FLOW = {
  title: 'Request flow — agent answering a question',
  note: 'schematic · the real thing has retries, caching and rate limits',

  lanes: [
    {
      label: 'entry',
      nodes: ['client', 'gateway', 'router'],
    },
    {
      label: 'retrieval',
      nodes: ['embed', 'search', 'rerank'],
    },
    {
      label: 'reasoning',
      nodes: ['planner', 'tools', 'synthesis'],
    },
    {
      label: 'delivery',
      nodes: ['stream', 'cache', 'client'],
    },
  ],
};
