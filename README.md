# Landing page · Dr. Daniel Martínez

Landing de una sola página para el Dr. Daniel Martínez, psiquiatra en Ciudad de México.
Astro con salida estática, sin framework de UI, pensada para desplegarse en Cloudflare Pages.

Épica de referencia: `Épica Landing page Dr. Daniel Martínez.md`
Lienzo de diseño: <https://claude.ai/artifact/6dYFyxaPxgdeJoGWog52Et>
Repositorio: <https://github.com/luishego/dr-daniel-martinez-landing> (privado)

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

El Dr. Martínez eligió la opción B, «Clínica cálida». `src/styles/tokens.css` es
la única fuente de los colores: define los tokens semánticos (`--color-primary`,
`--color-ink`…) que consume toda la UI. La paleta A y el switch para alternarla
se retiraron.

### Reglas de contraste que no se deben romper

Están comentadas en `tokens.css` y verificadas en el lienzo:

1. El acento (ocre `#EE9B00`) siempre lleva texto tinta o
   azul profundo: `--color-accent-ink`. Con blanco baja a 2.5:1 y reprueba AA.
2. El secundario (turquesa `#0A9396`) solo para íconos,
   viñetas y texto de 24px o más.
3. El granate `--color-alert` solo para errores del formulario y el aviso de
   urgencias. No es un color de marca.

## Contenido

Todo el texto vive en `src/content` (content collections con esquema zod), no en
los componentes: el copy clínico es provisional hasta que el doctor lo apruebe
por escrito. Los datos que faltan están marcados entre corchetes —
`[FOTOGRAFÍA DEL DR. MARTÍNEZ]`, `Cédula profesional [NÚMERO]`— para que no se
publiquen por descuido. El campo `notaInterna` de cada archivo no se renderiza:
documenta el estado de ese texto.

| Colección   | Archivo                                | Qué alimenta                    |
| ----------- | -------------------------------------- | ------------------------------- |
| `sitio`     | `src/content/sitio/sitio.json`         | Marca, SEO, navegación, clínica |
| `inicio`    | `src/content/inicio/hero.json`         | Hero y franja de credenciales   |
| `sobre`     | `src/content/sobre/sobre.json`         | Sección Sobre el Doctor         |
| `servicios` | `src/content/servicios/servicios.json` | Tratamientos y bloque de EMT    |

## Tipografía

Nunito (400/700/800) autoalojada por la API `fonts` de Astro: nada se pide a
Google en tiempo de ejecución. `font-display: swap` y precarga del archivo del
subconjunto `latin`, que es el que pinta el título del hero. Google la entrega
como fuente variable, así que un solo archivo por subconjunto cubre los tres
pesos.

## Despliegue en Cloudflare Pages

Salida estática, sin adapter mientras no haya SSR.

| Ajuste                 | Valor                                                 |
| ---------------------- | ----------------------------------------------------- |
| Build command          | `npm run build`                                       |
| Build output directory | `dist`                                                |
| Root directory         | vacío: este directorio **es** la raíz del repositorio |
| Framework preset       | Astro                                                 |
| Production branch      | `main`                                                |
| Node                   | `22` (lo toma de `.nvmrc`)                            |

Las previews por rama vienen activadas por defecto en Cloudflare Pages: cada
rama genera su propia URL para enseñársela al doctor, y producción sale de
`main`. `public/_headers` ya lleva cabeceras de seguridad y caché perpetua para
`/_astro/*`.

### Conectar el proyecto por primera vez

Las previews automáticas por rama solo existen si el proyecto de Pages está
conectado al repositorio de Git; `wrangler pages project create` no hace esa
conexión, solo crea proyectos de subida directa. Hay que hacerlo una vez desde
el panel:

1. Cloudflare → **Workers & Pages** → **Create** → pestaña **Pages** →
   **Connect to Git**.
2. Autorizar GitHub y elegir este repositorio.
3. Rellenar con la tabla de arriba y **Save and Deploy**.

A partir de ahí cada push a `main` publica producción y cada rama genera su
propia URL de preview.

## Estado

Hecho: T-01 a T-07 (setup, tokens, tipografía, layout y header, Inicio, Sobre
el Doctor y Tratamientos).

Pendiente: T-08 Ubicación, T-09 FAQ, T-10 Contacto,
T-11 footer/SEO/JSON-LD, T-12 QA. Los enlaces del menú a esas anclas ya existen
y empiezan a funcionar conforme entra cada sección.
