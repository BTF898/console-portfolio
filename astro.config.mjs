import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site';

// The deployed URL drives canonical links, the sitemap and Open Graph tags.
// It lives in src/config/site.ts so buyers never have to touch this file.
export default defineConfig({
  site: SITE.url,
  output: 'static',
  integrations: [mdx(), sitemap()],
  build: {
    // Small sheets inline automatically; the big design system stays cached.
    inlineStylesheets: 'auto',
  },
});
