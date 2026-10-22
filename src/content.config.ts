import { defineCollection } from 'astro:content';
import * as z from 'zod';
import { glob } from 'astro/loaders';

/**
 * Todo el texto de la landing vive en `src/content`, no en los componentes:
 * el copy clínico es provisional hasta que el Dr. Martínez lo apruebe por
 * escrito, y los datos que faltan (cédulas, teléfonos, segunda clínica) se
 * editan aquí sin tocar una sola línea de maquetado.
 *
 * `notaInterna` no se renderiza nunca: solo documenta el estado del texto para
 * quien lo edite después.
 */

const enlace = z.object({
  etiqueta: z.string(),
  ancla: z.string(),
});

const marcadorImagen = z.object({
  /** Marcador entre corchetes mientras no llega la fotografía del cliente. */
  marcador: z.string(),
  nota: z.string().optional(),
  /** Texto alternativo a usar cuando se sustituya por la foto real. */
  alt: z.string().optional(),
});

const sitio = defineCollection({
  loader: glob({ pattern: 'sitio.json', base: './src/content/sitio' }),
  schema: z.object({
    nombre: z.string(),
    especialidad: z.string(),
    seo: z.object({
      titulo: z.string(),
      descripcion: z.string(),
    }),
    navegacion: z.array(
      enlace.extend({
        /**
         * En escritorio el nombre del doctor ya enlaza a Inicio, igual que en
         * el lienzo de diseño; el menú móvil sí lista las seis secciones.
         */
        enEscritorio: z.boolean().default(true),
      }),
    ),
    ctaHeader: enlace,
    clinica: z.object({
      nombre: z.string(),
      calle: z.string(),
      colonia: z.string(),
      alcaldia: z.string(),
      codigoPostal: z.string(),
      ciudad: z.string(),
    }),
    notaInterna: z.string().optional(),
  }),
});

const inicio = defineCollection({
  loader: glob({ pattern: 'hero.json', base: './src/content/inicio' }),
  schema: z.object({
    antetitulo: z.string(),
    titulo: z.string(),
    entrada: z.string(),
    ctaPrincipal: enlace,
    ctaSecundario: enlace,
    imagen: marcadorImagen,
    /** Franja de credenciales inmediatamente debajo del hero. */
    franja: z.array(
      z.object({
        titulo: z.string(),
        detalle: z.string(),
      }),
    ),
    notaInterna: z.string().optional(),
  }),
});

const sobre = defineCollection({
  loader: glob({ pattern: 'sobre.json', base: './src/content/sobre' }),
  schema: z.object({
    antetitulo: z.string(),
    titulo: z.string(),
    parrafos: z.array(z.string()),
    imagen: marcadorImagen,
    tituloFormacion: z.string(),
    formacion: z.array(z.string()),
    cedulas: z.array(z.string()),
    notaInterna: z.string().optional(),
  }),
});

const servicios = defineCollection({
  loader: glob({ pattern: 'servicios.json', base: './src/content/servicios' }),
  schema: z.object({
    antetitulo: z.string(),
    titulo: z.string(),
    entrada: z.string(),
    tratamientos: z.array(
      z.object({
        /** Nombre del ícono de línea que dibuja `Servicios.astro`. */
        icono: z.enum(['foco', 'calendario', 'pastilla', 'dialogo']),
        titulo: z.string(),
        descripcion: z.string(),
      }),
    ),
    /** Bloque de Estimulación Magnética Transcraneal, el diferenciador. */
    destacado: z.object({
      etiqueta: z.string(),
      titulo: z.string(),
      parrafos: z.array(z.string()),
      puntos: z.array(z.string()),
      cta: enlace,
    }),
    notaInterna: z.string().optional(),
  }),
});

export const collections = { sitio, inicio, sobre, servicios };
