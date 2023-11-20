import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './remark-reading-time.mjs';

export default defineConfig({
  site: 'https://blog.damato.design',
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: 'css-variables' },
    remarkPlugins: [remarkReadingTime],
  },
});
