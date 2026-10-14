// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// Dominio pendiente del cliente: en cuanto se confirme, se añade `site: 'https://…'`
// para canonical, Open Graph y sitemap (T-11).
export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Hoja de estilos pequeña: Astro la inyecta en línea y ahorra una petición.
    inlineStylesheets: 'auto',
  },
  fonts: [
    {
      name: 'Nunito',
      cssVariable: '--fuente-base',
      provider: fontProviders.google(),
      // 400 lectura · 700 subtítulos y botones · 800 títulos
      weights: [400, 700, 800],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      display: 'swap',
      fallbacks: ['system-ui', 'Segoe UI', 'sans-serif'],
    },
  ],
});
