import type { APIRoute } from 'astro';

// Sin dominio configurado (preview) se pide no indexar nada.
export const GET: APIRoute = ({ site }) => {
  const lineas = site
    ? ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap.xml', site).href}`]
    : ['User-agent: *', 'Disallow: /'];
  return new Response(`${lineas.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
