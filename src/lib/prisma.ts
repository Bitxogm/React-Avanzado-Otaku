/**
 * Este archivo inicializa Prisma Client. Prisma es el ORM (Object-Relational Mapper)
 * que utilizamos para comunicarnos con la base de datos usando TypeScript en lugar de SQL puro.
 */
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";

// Usamos globalThis para anclar la instancia de Prisma al espacio global de Node.js
// Este es un "hack" necesario solo para el desarrollo local con Next.js.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Función encapsulada para crear la primera conexión
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  // Fallamos rápidamente si no hay URL de conexión en el archivo .env
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not defined in the environment variables.",
    );
  }

  // Configuración de adaptador para PostgreSQL (si usas bases de apps serverless, etc)
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// 🐛 EVITAR MÚLTIPLES CONEXIONES EN DESARROLLO:
// Cada vez que guardas un archivo, Next.js recarga la lógica del servidor (Hot Reloading).
// Si no hiciéramos esto, crearíamos cientos de conexiones a la BD y esta colapsaría.
// Por eso probamos primero globalForPrisma.prisma, para reutilizar la conexión.
const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Guardamos la referencia global SOLO si no estamos en 'production'
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Por defecto, exportamos la instancia lista para importar en cualquier archivo (como lib/projects.ts)
export default prisma;
