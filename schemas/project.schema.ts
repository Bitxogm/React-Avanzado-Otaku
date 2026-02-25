import { z } from "zod";

/**
 * ESQUEMAS DE ZOD (Librería de validación)
 * Zod nos permite crear "moldes" estrictos para validar que los datos 
 * que entran a nuestro sistema sean exactamente como los esperamos.
 */

// Esquema de validación para la creación de un proyecto
export const createProjectSchema = z.object({
  // El título debe ser un String forzosamente
  title: z
    .string()
    // Si tiene menos de 1 caracter, lanza este mensaje de error
    .min(1, "El título del proyecto es obligatorio")
    // Si tiene más de 20, lanza este otro
    .max(20, "El título no puede tener más de 20 caracteres"),

  // La descripción es un String, pero si no la envían, por defecto será un objeto vacío ("")
  description: z.string().default(""),
});

// Zod es tan brillante que podemos extraer/inferir un TIPO puro de TypeScript 
// a partir del esquema. ¡Así no tenemos que escribir el tipado dos veces!
export type CreatedProjectSchema = z.infer<typeof createProjectSchema>;
