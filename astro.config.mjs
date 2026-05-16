import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://quinnmush.github.io',
  integrations: [sitemap()],
});
