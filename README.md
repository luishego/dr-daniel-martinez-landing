# Landing page · Dr. Daniel Martínez

Landing de una sola página para el Dr. Daniel Martínez, psiquiatra en Ciudad de México.
Astro con salida estática, sin framework de UI, pensada para desplegarse como Worker con assets estáticos en Cloudflare.

Épica de referencia: `Épica Landing page Dr. Daniel Martínez.md`

## Cómo trabajar

```bash
npm install
npm run dev
```

| Comando                | Qué hace                                         |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Servidor de desarrollo en `localhost:4321`       |
| `npm run build`        | Build estático a `dist/`                         |
| `npm run preview`      | Sirve el build para revisarlo                    |
| `npm run check`        | Diagnóstico de TypeScript y de archivos `.astro` |
| `npm run lint`         | ESLint                                           |
| `npm run format`       | Prettier (escribe)                               |
| `npm run format:check` | Prettier (solo verifica)                         |

Node fijado en `.nvmrc` (22). Astro 7 exige 22.12 o superior.

## Paleta

Clínica cálida. `src/styles/tokens.css` es
la única fuente de los colores: define los tokens semánticos (`--color-primary`,
`--color-ink`…) que consume toda la UI.

### Reglas de contraste

1. El acento (ocre `#EE9B00`) siempre lleva texto tinta o
   azul profundo: `--color-accent-ink`. Con blanco baja a 2.5:1 y reprueba AA.
2. El secundario (turquesa `#0A9396`) solo para íconos,
   viñetas y texto de 24px o más.
3. El granate `--color-alert` solo para errores del formulario y el aviso de
   urgencias. No es un color de marca.

## Contenido

Todo el texto vive en `src/content` (content collections con esquema zod), el campo `notaInterna` de cada archivo no se renderiza.

| Colección    | Archivo                                  | Qué alimenta                              |
| ------------ | ---------------------------------------- | ----------------------------------------- |
| `sitio`      | `src/content/sitio/sitio.json`           | Marca, SEO, navegación, clínica           |
| `inicio`     | `src/content/inicio/hero.json`           | Hero y franja de credenciales             |
| `sobre`      | `src/content/sobre/sobre.json`           | Sección Sobre el Doctor                   |
| `servicios`  | `src/content/servicios/servicios.json`   | Tratamientos y bloque de EMT              |
| `ubicacion`  | `src/content/ubicacion/ubicacion.json`   | Sedes, horarios y mapa                    |
| `contacto`   | `src/content/contacto/contacto.json`     | WhatsApp, datos de recepción y formulario |
| `privacidad` | `src/content/privacidad/privacidad.json` | Aviso de privacidad (modal, borrador)     |
| `preguntas`  | `src/content/preguntas/preguntas.json`   | FAQ, aviso de urgencias, JSON-LD          |

## SEO y seguridad

- **Dominio:** se configura con la variable de entorno `SITE_URL` en el build de
  producción (p. ej. `https://www.dominio.mx`). Con ella el sitio emite
  `canonical`, `og:url`, `sitemap.xml` y un `robots.txt` que permite indexar.
  Sin ella, que es el caso de las previews y del desarrollo, el sitio lleva
  `noindex`, `robots.txt` con `Disallow: /` y un sitemap vacío.
- **JSON-LD:** `MedicalClinic` y `Physician` (`JsonLdSitio.astro`) más el
  `FAQPage` de Preguntas. Solo incluyen datos validados: un valor con corchetes
  no entra al marcado.
- **CSP:** la emite Astro (`security.csp` en `astro.config.mjs`) en un `<meta>`
  con hashes de sus scripts y estilos; `frame-ancestors` va en
  `public/_headers`. Si se agrega un recurso de terceros (analíticas, otro
  mapa, otra fuente) hay que declararlo en esa lista.
- **Pendiente:** imagen Open Graph, cuando el cliente entregue la fotografía.

## Tipografía

Nunito (400/700/800) autoalojada por la API `fonts` de Astro: nada se pide a
Google en tiempo de ejecución. `font-display: swap` y precarga del archivo del
subconjunto `latin`, que es el que pinta el título del hero. Google la entrega
como fuente variable, así que un solo archivo por subconjunto cubre los tres
pesos.

## Despliegue en Cloudflare

El proyecto es un **Worker con assets estáticos** (Workers Builds).
El build corre `npm run build` y `wrangler.jsonc` indica que se sirve
`dist/`, incluidos los encabezados de `public/_headers`.

| Ajuste                       | Valor                                                 |
| ---------------------------- | ----------------------------------------------------- |
| Build command                | `npm run build`                                       |
| Deploy command (producción)  | `npx wrangler deploy`                                 |
| Deploy command (otras ramas) | `npx wrangler preview`                                |
| Root directory               | vacío: este directorio **es** la raíz del repositorio |
| Production branch            | `main`                                                |
| Node                         | `22` (lo toma de `.nvmrc`)                            |

- `wrangler.jsonc` declara el directorio de assets y el bloque `previews`, que
  `wrangler preview` exige aunque vaya vacío.
- El `name` de `wrangler.jsonc` debe coincidir con el nombre del Worker en el
  panel de Cloudflare.
- `worker/index.ts` atiende `POST /api/contacto` (el formulario de Contacto); lo
  demás lo sirve Cloudflare directo desde `dist/`. Valida los campos, descarta
  los envíos con el campo trampa lleno, solo acepta el mismo origen y manda el
  correo por la API de Resend.
- Para que el formulario envíe hay que crear tres secretos en el panel del
  Worker (Settings → Variables and Secrets): `RESEND_API_KEY`, `CONTACT_TO`
  (correo de recepción) y `CONTACT_FROM` (remitente de un dominio verificado en
  Resend). Sin ellos responde 503 y el formulario sugiere WhatsApp.

### QA

Revisado sobre el build a 390, 768 y 1440px: sin desbordamiento horizontal,
axe-core (WCAG 2.1 A/AA) sin violaciones, orden de tabulación lógico con foco
visible en todos los controles, enlace «Saltar al contenido», acordeón de
preguntas con teclado, menú móvil que abre y cierra, anclas que no quedan bajo el
header y sin violaciones de CSP.
