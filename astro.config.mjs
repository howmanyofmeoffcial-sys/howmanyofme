import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://howmanyofme.co',
  trailingSlash: 'never',
  integrations: [
    react(),
  ],
  vite: {
    build: {
      cssMinify: 'esbuild',
    },
    ssr: {
      noExternal: ['lucide-react', 'recharts'],
    },
  },
});
