import type { APIRoute } from 'astro';

// Landing de una sola página: el sitemap lista solo la portada y queda vacío
// mientras no haya dominio configurado.
export const GET: APIRoute = ({ site }) => {
  const urls = site ? `<url><loc>${new URL('/', site).href}</loc></url>` : '';
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
