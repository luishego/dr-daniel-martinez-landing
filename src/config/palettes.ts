/**
 * Fuente única de las paletas de la landing.
 *
 * Los valores de color NO viven aquí: viven en `src/styles/tokens.css`, que es
 * lo que el navegador realmente pinta. Este archivo describe las paletas
 * (identidad, nombre, orden, cuáles están habilitadas) y apunta a las
 * variables CSS de cada una, así que no hay dos listas de hexadecimales que
 * puedan desincronizarse.
 *
 * Cuando el Dr. Martínez elija una paleta:
 *   1. Dejar `idsHabilitados` con un solo id.
 *   2. Poner `PUBLIC_SHOW_PALETTE_SWITCH=false` en el build de producción.
 * Ningún componente cambia.
 */

export const ID_PALETAS = ['b', 'a'] as const;

export type IdPaleta = (typeof ID_PALETAS)[number];

export interface Paleta {
  /** Valor que se escribe en `html[data-palette]` y en `?palette=`. */
  id: IdPaleta;
  /** Cómo se nombra ante el cliente: «Opción B». */
  etiqueta: string;
  /** Nombre de la paleta: «Clínica cálida». */
  nombre: string;
  /** Una línea para el switch y para la presentación. */
  descripcion: string;
  /**
   * Las dos variables CSS que se muestran como muestras de color en el switch.
   * Se leen de `tokens.css`, donde están definidas para todas las paletas a la
   * vez, independientemente de cuál esté activa.
   */
  muestras: readonly [string, string];
}

export const paletas: readonly Paleta[] = [
  {
    id: 'b',
    etiqueta: 'Opción B',
    nombre: 'Clínica cálida',
    descripcion: 'Petróleo para la autoridad médica, arena para la cercanía',
    muestras: ['--b-primary', '--b-accent'],
  },
  {
    id: 'a',
    etiqueta: 'Opción A',
    nombre: 'Confianza serena',
    descripcion: 'Alternativa de tono más institucional',
    muestras: ['--a-primary', '--a-accent'],
  },
];

/** La paleta recomendada al cliente y la que se ve sin JavaScript. */
export const paletaPorDefecto: IdPaleta = 'b';

/** La lista que se recorta cuando el cliente decide. */
export const idsHabilitados: readonly IdPaleta[] = ['b', 'a'];

export const paletasHabilitadas: readonly Paleta[] = paletas.filter((paleta) =>
  idsHabilitados.includes(paleta.id),
);

/** Clave de localStorage donde se recuerda la elección. */
export const CLAVE_PALETA = 'dm:paleta';

/** Parámetro de URL para compartir un link con una paleta concreta. */
export const PARAMETRO_PALETA = 'palette';

/**
 * El switch es una herramienta de presentación, no parte del sitio final.
 * Con PUBLIC_SHOW_PALETTE_SWITCH=false no se renderiza ni el switch ni el
 * script de <head>, así que la paleta queda fijada por el servidor y un valor
 * viejo en localStorage no puede cambiar la página publicada.
 * Sin la variable definida se asume `true`, que es lo útil en desarrollo.
 */
export const mostrarSwitchPaletas: boolean =
  import.meta.env.PUBLIC_SHOW_PALETTE_SWITCH !== 'false' && paletasHabilitadas.length > 1;

export function esIdPaleta(valor: unknown): valor is IdPaleta {
  return typeof valor === 'string' && (idsHabilitados as readonly string[]).includes(valor);
}

export function obtenerPaleta(id: IdPaleta): Paleta {
  const paleta = paletas.find((candidata) => candidata.id === id);
  if (!paleta) {
    throw new Error(`Paleta desconocida: ${id}`);
  }
  return paleta;
}
