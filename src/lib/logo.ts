import logoSvg from '../assets/logo.svg?raw';

/**
 * El logo del doctor es un único trazo vectorial en `src/assets/logo.svg`. Se
 * toma su geometría una sola vez para definirla en el HTML (`LogoDefs.astro`) y
 * reutilizarla con `<use>` en el header y el footer, de modo que el color lo
 * decide `currentColor` y la página no repite los 34 KB del trazo.
 */
const trazo = /\sd="([^"]+)"/s.exec(logoSvg)?.[1];
if (!trazo) {
  throw new Error('No se encontró el trazo en src/assets/logo.svg');
}

export const trazoLogo = trazo.replace(/\s+/g, ' ');

/**
 * Recortes del lienzo de 2752×1536 del logo (viewBox: x y ancho alto). Entre el
 * símbolo y el nombre hay una franja vacía en y = 899–900, por eso el símbolo
 * se puede aislar sin cortar nada.
 */
export const recortesLogo = {
  completo: '553 179 1660 1165',
  simbolo: '910 189 991 710',
} as const;
