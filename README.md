# Landing page · Dr. Daniel Martínez

Landing de una sola página para el Dr. Daniel Martínez, psiquiatra en Ciudad de México.
Astro con salida estática, sin framework de UI, pensada para desplegarse en Cloudflare Pages.

Épica de referencia: `Épica Landing page Dr. Daniel Martínez.md`
Lienzo de diseño: <https://claude.ai/artifact/6dYFyxaPxgdeJoGWog52Et>

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

## El sistema de paletas

El cliente todavía no elige entre las dos paletas propuestas, así que la página
las trae las dos y se pueden alternar en vivo:

- `src/styles/tokens.css` es la única fuente de los colores. Define las escalas
  crudas de cada paleta (`--b-*`, `--a-*`) y mapea los tokens semánticos
  (`--color-primary`, `--color-ink`…) bajo `html[data-palette="…"]`.
- `src/config/palettes.ts` describe las paletas (id, nombre, orden, cuáles están
  habilitadas) y apunta a sus variables CSS. No repite hexadecimales.
- `PaletteSwitchHead.astro` aplica la paleta dentro de `<head>`, antes del primer
  render, en este orden: `?palette=` → `localStorage` → paleta por defecto.
- `PaletteSwitch.astro` es el control fijo en la esquina inferior derecha.

Cosas que se pueden hacer sin tocar un componente:

- **Compartir una paleta concreta:** `…/?palette=a` o `…/?palette=b`.
- **Dejar una sola opción:** recortar `idsHabilitados` en `palettes.ts`.
- **Quitar el switch del build final:** `PUBLIC_SHOW_PALETTE_SWITCH=false`.
  Con eso tampoco se renderiza el script de `<head>`, así que la paleta la fija
  el servidor y un valor viejo en `localStorage` no puede alterar la página.

### Reglas de contraste que no se deben romper

Están comentadas en `tokens.css` y verificadas en el lienzo:

1. El acento (ocre `#EE9B00` / naranja `#FB8500`) siempre lleva texto tinta o
   azul profundo: `--color-accent-ink`. Con blanco baja a 2.5:1 y reprueba AA.
2. El secundario (turquesa `#0A9396` / azul cielo `#219EBC`) solo para íconos,
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

| Colección | Archivo                        | Qué alimenta                    |
| --------- | ------------------------------ | ------------------------------- |
| `sitio`   | `src/content/sitio/sitio.json` | Marca, SEO, navegación, clínica |
| `inicio`  | `src/content/inicio/hero.json` | Hero y franja de credenciales   |
| `sobre`   | `src/content/sobre/sobre.json` | Sección Sobre el Doctor         |

## Tipografía

Nunito (400/700/800) autoalojada por la API `fonts` de Astro: nada se pide a
Google en tiempo de ejecución. `font-display: swap` y precarga del archivo del
subconjunto `latin`, que es el que pinta el título del hero. Google la entrega
como fuente variable, así que un solo archivo por subconjunto cubre los tres
pesos.

## Despliegue en Cloudflare Pages

Salida estática, sin adapter mientras no haya SSR.

| Ajuste                 | Valor                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Build command          | `npm run build`                                                                             |
| Build output directory | `dist`                                                                                      |
| Root directory         | vacío: este directorio **es** la raíz del repositorio                                       |
| Framework preset       | Astro                                                                                       |
| Production branch      | `main`                                                                                      |
| Node                   | `22` (lo toma de `.nvmrc`)                                                                  |
| Variable de entorno    | `PUBLIC_SHOW_PALETTE_SWITCH=true` en previews, `false` en producción cuando el doctor elija |

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

Hecho: T-01 a T-06 (setup, tokens y paletas, tipografía, switch, layout y
header, Inicio y Sobre el Doctor).

Pendiente: T-07 Servicios, T-08 Ubicación, T-09 FAQ, T-10 Contacto,
T-11 footer/SEO/JSON-LD, T-12 QA. Los enlaces del menú a esas anclas ya existen
y empiezan a funcionar conforme entra cada sección.
