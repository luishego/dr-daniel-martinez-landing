// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// El dominio llega por variable de entorno (`SITE_URL`, p. ej.
// https://www.dominio.mx) en el build de producción. Sin ella el sitio se trata
// como preview: sin canonical, sin sitemap y con `noindex`.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Hoja de estilos pequeña: Astro la inyecta en línea y ahorra una petición.
    inlineStylesheets: 'auto',
  },
  security: {
    // Astro calcula los hashes de sus scripts y estilos en línea y emite la
    // política en un <meta>. `frame-ancestors` no vale en <meta>: va en
    // `public/_headers`.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        // El formulario de contacto envía a /api/contacto, en el mismo origen.
        "connect-src 'self'",
        "form-action 'self'",
        // Mapa diferido de la sección Ubicación.
        'frame-src https://www.google.com',
        "base-uri 'self'",
        "object-src 'none'",
      ],
    },
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
