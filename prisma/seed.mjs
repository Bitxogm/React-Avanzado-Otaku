/**
 * SCRIPT DE SEEDING (Población de datos)
 * Se encarga de llenar la Base de Datos vacía con información útil inicial (mock data)
 * para que no tengas que crear proyectos manualmente al iniciar la aplicación.
 */
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import readline from "readline";

const { PrismaClient } = pkg;

// Al ser un script externo suelto (no ejecutado por Next.js), cargamos la variable manualmente
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Configuración de Prisma igual que en el entorno normal (ver src/lib/prisma.ts)
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "s" || answer.toLowerCase() === "y");
    });
  });
}

async function main() {
  const projects = [
    {
      title: "Refactor checkout",
      description: "Mejorar la validacion de cupones y tiempos de respuesta.",
    },
    {
      title: "Dashboard analytics",
      description:
        "Construir panel con metricas de conversion y sesiones activas.",
    },
    {
      title: "Onboarding flow",
      description:
        "Reducir abandono del registro con una experiencia guiada en 3 pasos.",
    },
    {
      title: "OAuth Integration",
      description:
        "Implementar inicio de sesión con Google y GitHub para simplificar el registro.",
    },
    {
      title: "Performance Optimization",
      description:
        "Reducir el tiempo de carga de la aplicación a menos de 2 segundos.",
    },
    {
      title: "Mobile App",
      description: "Desarrollar versión nativa para iOS y Android usando React Native.",
    },
    {
      title: "API Rate Limiting",
      description:
        "Implementar rate limiting y throttling para proteger contra ataques.",
    },
    {
      title: "Dark Mode Support",
      description: "Agregar tema oscuro con sincronización de preferencias del usuario.",
    },
  ];

  // Preguntar confirmación antes de limpiar
  const confirm = await askConfirmation(
    "⚠️  Esto borrará todos los proyectos existentes. ¿Deseas continuar? (s/n): "
  );

  if (!confirm) {
    console.log("❌ Operación cancelada");
    return;
  }

  // Limpiar proyectos existentes
  const deleted = await prisma.project.deleteMany({});
  console.log(`🗑️  Se borraron ${deleted.count} proyectos`);

  // Crear nuevos proyectos
  const created = await prisma.project.createMany({
    data: projects,
  });

  console.log("✅ Seed completado: Se crearon", created.count, "proyectos");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
