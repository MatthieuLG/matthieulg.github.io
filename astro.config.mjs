import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Site utilisateur GitHub Pages : servi à la racine, pas de `base` nécessaire.
export default defineConfig({
  site: 'https://matthieulg.github.io',
  integrations: [
    react(),
    // Plan du site, avec les correspondances français / anglais de chaque page.
    sitemap({
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr', en: 'en' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
