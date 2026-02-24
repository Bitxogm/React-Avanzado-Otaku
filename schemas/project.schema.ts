import { z } from "zod";

// Esquema de validación para la creación de un proyecto

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "El título del proyecto es obligatorio")
    .max(20, "El título no puede tener más de 20 caracteres"),
  description: z.string().default(""),
});

export type CreatedProjectSchema = z.infer<typeof createProjectSchema>;
