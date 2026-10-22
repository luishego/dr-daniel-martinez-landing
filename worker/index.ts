/**
 * Worker de la landing: sirve los assets estáticos y atiende POST /api/contacto.
 *
 * Solo `/api/*` pasa por aquí (`run_worker_first` en wrangler.jsonc); el resto
 * lo sirve Cloudflare directo desde `dist/`. El correo sale por la API de
 * Resend, con tres secretos que se configuran en el panel de Cloudflare:
 *   RESEND_API_KEY · CONTACT_TO (recepción) · CONTACT_FROM (remitente verificado)
 * Si falta alguno responde 503 y la página sugiere WhatsApp.
 */

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const MAX_BYTES = 10_000;

const json = (cuerpo: unknown, status = 200): Response =>
  Response.json(cuerpo, { status, headers: { 'Cache-Control': 'no-store' } });

const texto = (valor: unknown, max: number): string =>
  typeof valor === 'string' ? valor.trim().slice(0, max) : '';

/** Quita saltos de línea y caracteres de control de lo que va a un encabezado. */
const lineaUnica = (valor: string): string => valor.replace(/\p{Cc}+/gu, ' ').trim();

async function contacto(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'metodo' }, 405);
  }

  // Solo se acepta el formulario del propio sitio.
  const origen = request.headers.get('Origin');
  if (origen && new URL(origen).host !== new URL(request.url).host) {
    return json({ error: 'origen' }, 403);
  }

  const crudo = await request.text();
  if (crudo.length > MAX_BYTES) {
    return json({ error: 'tamano' }, 413);
  }

  let datos: Record<string, unknown>;
  try {
    datos = JSON.parse(crudo);
  } catch {
    return json({ error: 'formato' }, 400);
  }

  // Campo trampa: un humano no lo ve ni lo llena. A un bot se le responde que
  // todo salió bien para que no reintente.
  if (texto(datos.web, 200) !== '') {
    return json({ ok: true });
  }

  const nombre = lineaUnica(texto(datos.nombre, 100));
  const telefono = lineaUnica(texto(datos.telefono, 30));
  const correo = lineaUnica(texto(datos.correo, 120));
  const mensaje = texto(datos.mensaje, 1000);

  const errores: Record<string, boolean> = {};
  if (nombre.length < 2) errores.nombre = true;
  if (telefono.replace(/\D/g, '').length < 10) errores.telefono = true;
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.correo = true;
  if (datos.consentimiento !== true) errores.consentimiento = true;
  if (Object.keys(errores).length > 0) {
    return json({ error: 'campos', campos: errores }, 422);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return json({ error: 'no_configurado' }, 503);
  }

  const cuerpo = [
    `Nombre: ${nombre}`,
    `Teléfono: ${telefono}`,
    `Correo: ${correo || '(no indicó)'}`,
    '',
    mensaje || '(sin mensaje)',
  ].join('\n');

  const envio = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      ...(correo ? { reply_to: correo } : {}),
      subject: 'Nueva solicitud de cita desde la landing',
      text: cuerpo,
    }),
  });

  if (!envio.ok) {
    return json({ error: 'envio' }, 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contacto') {
      return contacto(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
