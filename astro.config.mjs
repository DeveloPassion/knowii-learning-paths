import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://learn.knowii.net',
  trailingSlash: 'never',
  build: { format: 'file' },
});
