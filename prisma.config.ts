import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * ARCHIVO DE CONFIGURACIÓN TEMPRANA DE PRISMA
 * Le dice explícitamente a Prisma dónde está tu archivo .env y el .prisma
 * Esto asegura que los comandos por terminal como `prisma generate` no fallen.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"), // Toma la cadena exacta que pusiste en .env
  },
});
