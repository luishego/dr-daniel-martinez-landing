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
    footer: z.object({
      lema: z.string(),
      aviso: z.string(),
      privacidad: enlace,
    }),
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
    /** La foto vive en `src/assets`; aquí solo su texto alternativo. */
    imagen: z.object({ alt: z.string() }),
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
    /** La foto vive en `src/assets`; aquí solo su texto alternativo. */
    imagen: z.object({ alt: z.string() }),
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
      subtitulo: z.string(),
      parrafos: z.array(z.string()),
      /** Tarjetas de apoyo: cómo es la sesión, beneficios, seguridad… */
      detalles: z.array(z.object({ titulo: z.string(), texto: z.string() })),
      /** Aviso final: la EMT complementa, no reemplaza. */
      nota: z.string(),
      cta: enlace,
    }),
    notaInterna: z.string().optional(),
  }),
});

const ubicacion = defineCollection({
  loader: glob({ pattern: 'ubicacion.json', base: './src/content/ubicacion' }),
  schema: z.object({
    antetitulo: z.string(),
    titulo: z.string(),
    entrada: z.string(),
    /** Datos extra de la sede principal; su dirección vive en `sitio.json`. */
    principal: z.object({
      horario: z.string(),
      referencia: z.string().optional(),
    }),
    /** Otras sedes; mientras la dirección lleve corchetes no se ofrece mapa. */
    otras: z.array(
      z.object({
        nombre: z.string(),
        direccion: z.string(),
        horario: z.string(),
        referencia: z.string().optional(),
      }),
    ),
    textos: z.object({
      verMapa: z.string(),
      comoLlegar: z.string(),
      cerrarMapa: z.string(),
    }),
    notaInterna: z.string().optional(),
  }),
});

const preguntas = defineCollection({
  loader: glob({ pattern: 'preguntas.json', base: './src/content/preguntas' }),
  schema: z.object({
    antetitulo: z.string(),
    titulo: z.string(),
    entrada: z.string(),
    /** Una respuesta con corchetes está pendiente y no entra al JSON-LD. */
    preguntas: z.array(
      z.object({
        pregunta: z.string(),
        respuesta: z.string(),
      }),
    ),
    avisoUrgencias: z.object({
      titulo: z.string(),
      texto: z.string(),
      telefono: z.string(),
      horario: z.string(),
    }),
    notaInterna: z.string().optional(),
  }),
});

const contacto = defineCollection({
  loader: glob({ pattern: 'contacto.json', base: './src/content/contacto' }),
  schema: z.object({
    antetitulo: z.string(),
    titulo: z.string(),
    entrada: z.string(),
    whatsapp: z.object({
      etiqueta: z.string(),
      /** Con corchetes mientras falte el dato: el botón no será un enlace. */
      numero: z.string(),
      mensaje: z.string(),
    }),
    telefono: z.string(),
    correo: z.string(),
    formulario: z.object({
      titulo: z.string(),
      aviso: z.string(),
      campos: z.object({
        nombre: z.string(),
        mensaje: z.string(),
      }),
      consentimiento: z.string(),
      avisoPrivacidad: enlace,
      enviar: z.string(),
      exito: z.string(),
      enlaceRespaldo: z.string(),
      sinWhatsapp: z.string(),
      errorCampos: z.string(),
      errores: z.object({
        nombre: z.string(),
        consentimiento: z.string(),
      }),
      /** Mensaje que se arma; `{nombre}` y `{mensaje}` se sustituyen. */
      plantilla: z.string(),
      plantillaMensaje: z.string(),
    }),
    notaInterna: z.string().optional(),
  }),
});

const privacidad = defineCollection({
  loader: glob({ pattern: 'privacidad.json', base: './src/content/privacidad' }),
  schema: z.object({
    antetitulo: z.string(),
    titulo: z.string(),
    /** Aviso visible de que el texto es un borrador sin validar. */
    borrador: z.string(),
    secciones: z.array(z.object({ titulo: z.string(), texto: z.string() })),
    notaInterna: z.string().optional(),
  }),
});

export const collections = {
  sitio,
  inicio,
  sobre,
  servicios,
  ubicacion,
  preguntas,
  contacto,
  privacidad,
};
