import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site';

// Mostly-static site with real API routes: every page is prerendered at build
// time except routes that opt out with `export const prerender = false`.
export default defineConfig({
  site: SITE.url,
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [mdx(), sitemap()],
  build: { inlineStylesheets: 'auto' },
});
