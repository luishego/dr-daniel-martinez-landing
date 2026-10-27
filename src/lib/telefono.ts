/** Solo los dígitos de un teléfono escrito con espacios, guiones o `+`. */
export const digitos = (valor: string): string => valor.replace(/\D/g, '');

/**
 * Número en formato internacional (sin `+`) para `tel:` y `wa.me`. Los números
 * mexicanos se escriben a 10 dígitos («55 1750 8612»), así que se les antepone
 * el 52; si ya traen otro prefijo (11 dígitos o más) se dejan tal cual.
 */
export const internacional = (valor: string): string => {
  const numero = digitos(valor);
  return numero.length === 10 ? `52${numero}` : numero;
};
