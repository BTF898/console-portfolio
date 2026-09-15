/* ==========================================================================
   terminal.ts — the script the hero console "types" on its own.
   Each entry: a command and the lines it prints. Keep lines short (the
   console is ~45 characters wide on phones). This is demo content — make it
   yours. It is decorative (aria-hidden for screen readers), so keep real
   facts in the visible page too.
   ========================================================================== */

export interface TerminalStep {
  cmd: string;
  out: string[];
}

export const TERMINAL = {
  /** Shown in the console title bar and the prompt. */
  user: 'sam',
  host: 'portfolio',
  path: '~',

  steps: [
    {
      cmd: 'whoami',
      out: [
        'sam — full-stack engineer',
        'typescript · go · applied ai',
        'based in Berlin, DE',
      ],
    },
    {
      cmd: 'cat stack.txt',
      out: [
        'backend   node.js, go, postgres, redis',
        'frontend  react, astro, css',
        'ai        rag, agents, evals, vector search',
        'infra     docker, k8s, terraform, aws',
      ],
    },
    {
      cmd: './current.sh',
      out: [
        '▸ building realtime event pipelines at Northwind',
        '▸ shipping an eval harness for LLM features',
        '▸ open to interesting work',
      ],
    },
    {
      cmd: 'ls ./highlights',
      out: [
        'relay/       99.98% uptime event streaming',
        'pulseboard/  40k req/s metrics pipeline',
        'scout/       hybrid search in 12ms p95',
      ],
    },
  ] satisfies TerminalStep[],
};
