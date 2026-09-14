/* ==========================================================================
   site.ts — THE ONLY FILE most people ever need to edit.
   Change the values below to make the template yours, then run `npm run dev`.
   Every component reads from this config; there is nothing else to touch.
   ========================================================================== */

export const SITE = {
  /** Full name — used in the hero, title tag, nav brand and JSON-LD. */
  name: 'Sam Rivera',

  /** First name or initials — used for the nav logo mark. */
  initials: 'SR',

  /** Your professional headline. */
  role: 'Full-Stack Software Engineer',

  /** Short list of rotating headlines shown under your name (2–5 works best). */
  roles: ['Full-Stack Engineer', 'Systems Tinkerer', 'Applied AI Builder'],

  /** One-sentence pitch shown under the rotating roles. */
  tagline:
    'I build production systems in TypeScript and Go — and the applied AI that runs on them.',

  /** Where you are based. Shown in the About facts table. */
  location: 'Berlin, DE',

  /** Production URL. Drives canonical tags, the sitemap and Open Graph.
      Use http://localhost:4321 while developing locally if you like. */
  url: 'https://your-domain.com',

  /** Public contact email. Also wired into the ⌘K palette ("copy email"). */
  email: 'hello@your-domain.com',

  /** Avatar image path (put the file in /public). Square works best. */
  avatar: '/avatar.svg',

  /** Optional: link to your résumé PDF in /public (e.g. '/resume.pdf').
      Adds a "Résumé" button in the hero and a palette command. Empty = hidden. */
  resumeUrl: '',

  /** Availability badge shown in the hero. Set to '' to hide. */
  availability: 'Open to interesting work',

  /** GitHub username — powers the contribution heatmap (fetched at build time).
      Set it to YOUR username to go live. While it's '', the card shows clearly
      labeled demo data. */
  githubUsername: '',

  /** Social links — shown in the hero and footer. Add/remove freely. */
  socials: [
    { label: 'GitHub', handle: '@yourname', url: 'https://github.com/yourname' },
    { label: 'LinkedIn', handle: 'in/yourname', url: 'https://www.linkedin.com/in/yourname' },
    { label: 'X', handle: '@yourname', url: 'https://x.com/yourname' },
  ],

  /* ----- Theming ----- */
  theme: {
    /** Color preset: 'forest' (green + periwinkle), 'midnight' (slate + cyan),
        or 'reference' (the DESIGN-ANALYSIS.md reconstruction — this branch). */
    preset: 'reference' as 'forest' | 'midnight' | 'reference',
    /** Default color mode before the visitor toggles: 'dark' | 'light'. */
    mode: 'dark' as 'dark' | 'light',
  },

  /* ----- Contact form -----
     Paste an endpoint from a form service (Formspree, Web3Forms, Basin…)
     and the form in the Contact section goes live. Leave '' to show only
     the email call-to-action (no backend needed). */
  contact: {
    formEndpoint: '', // e.g. 'https://formspree.io/f/abcdwxyz'
  },

  /* ----- Feature switches ----- */
  features: {
    terminal: true, // self-typing console in the hero (script: src/config/terminal.ts)
    commandPalette: true, // ⌘K / Ctrl-K launcher
    flow: true, // animated pipeline strip
    github: true, // contribution heatmap card
    achievements: true, // exploration unlockables (config: src/config/achievements.ts)
  },

  /* ----- Marquee skills ----- */
  skills: [
    'TypeScript',
    'Node.js',
    'Go',
    'React',
    'PostgreSQL',
    'Redis',
    'Docker',
    'Kubernetes',
    'LLM agents',
    'RAG',
    'Vector search',
    'gRPC',
    'Terraform',
    'AWS',
  ],

  /* ----- Capability panels (the 3-card row) ----- */
  panels: [
    {
      icon: 'spark', // 'spark' | 'cloud' | 'shield'
      title: 'Applied AI',
      blurb:
        'Multi-agent workflows, retrieval-augmented generation and evaluation harnesses that hold up outside the demo.',
    },
    {
      icon: 'cloud',
      title: 'Systems & Cloud',
      blurb:
        'APIs, queues and data pipelines designed for boring reliability — observable, autoscaling and cheap to run.',
    },
    {
      icon: 'shield',
      title: 'Engineering Practice',
      blurb:
        'Typed contracts, CI that fails loudly, and documentation that the next engineer actually thanks you for.',
    },
  ],

  /* ----- About paragraphs ----- */
  about: [
    'I am a full-stack engineer who likes living on both sides of the API: the product surface people touch and the infrastructure it stands on. Most of my work has been shipping web platforms end to end — from schema design and queues to the last pixel of the settings page.',
    'Lately that work has grown an applied-AI layer: retrieval pipelines, agent tooling and evaluation loops that make LLM features reliable enough to ship. I care about the unglamorous parts — types, tests, dashboards, runbooks — because they are what let the fun parts stay shipped.',
  ],

  /* ----- About facts table (label / value rows) ----- */
  facts: [
    { label: 'Based in', value: 'Berlin, DE' },
    { label: 'Focus', value: 'Web platforms · Applied AI' },
    { label: 'Experience', value: '7+ years' },
    { label: 'Status', value: 'Open to interesting work' },
  ],

  /* ----- SEO ----- */
  seo: {
    /** Title pattern for the browser tab. {name} and {role} are replaced. */
    titleTemplate: '{name} · {role}',
    /** Meta description (also used for Open Graph). */
    description:
      'Sam Rivera — full-stack software engineer building production web platforms in TypeScript and Go, plus the applied AI that runs on them.',
    /** Open Graph image path in /public. Replace public/og.png (1200×630). */
    ogImage: '/og.png',
  },
} as const;

export type SiteConfig = typeof SITE;
