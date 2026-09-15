/**
 * Atelier site config — the single place to edit sitewide settings.
 * All demo content is fictional by design; replace it with your own.
 * NOTE: `url` must be the production URL once deployed (drives canonical
 * tags + sitemap).
 */
export const SITE = {
  name: 'Sam Rivera',
  firstName: 'Sam',
  initials: 'SR',
  role: 'Senior Software Engineer',
  location: 'Lisbon, Portugal',
  email: 'sam@samrivera.dev',
  url: 'http://localhost:4322',
  availability: 'Open to staff-level and founding-engineer roles',

  // Short line under the hero name.
  tagline:
    'I build fast, reliable product infrastructure — and I measure everything I ship.',

  // Professional summary used on the CV page and in /api/cv.json.
  summary:
    'Senior software engineer with 9 years of experience owning systems end to end — from schema design to on-call. I have a habit of leaving systems measurably better than I found them: latency cut, incidents prevented, release cycles compressed, teams unblocked.',

  socials: [
    { label: 'GitHub', handle: '@samrivera', url: 'https://github.com/samrivera' },
    { label: 'LinkedIn', handle: 'in/samrivera', url: 'https://www.linkedin.com/in/samrivera' },
    { label: 'Writing', handle: 'samrivera.dev/notes', url: 'https://example.com/notes' },
  ],

  // CV skills, grouped. Rendered in order on the CV page.
  skills: [
    {
      group: 'Languages',
      items: ['TypeScript', 'Go', 'Python', 'SQL', 'Rust (working)'],
    },
    {
      group: 'Backend & data',
      items: ['PostgreSQL', 'Redis', 'Kafka', 'gRPC', 'GraphQL', 'OpenTelemetry'],
    },
    {
      group: 'Infrastructure',
      items: ['Kubernetes', 'Terraform', 'AWS', 'Grafana/Prometheus', 'CI/CD (GitHub Actions)'],
    },
    {
      group: 'Practices',
      items: ['Incident command', 'Design reviews', 'Mentoring', 'SRE / on-call', 'A/B testing'],
    },
  ],

  education: [
    {
      school: 'University of Porto',
      degree: 'MSc, Computer Science',
      start: '2012',
      end: '2014',
      note: 'Thesis: latency-aware routing for multi-region services.',
    },
    {
      school: 'University of Porto',
      degree: 'BSc, Computer Science',
      start: '2009',
      end: '2012',
      note: '',
    },
  ],

  seo: {
    title: 'Sam Rivera — Senior Software Engineer',
    description:
      'Portfolio and CV of Sam Rivera, senior software engineer. Selected work, measurable impact, and a print-ready CV.',
  },
} as const;

export type SiteConfig = typeof SITE;
