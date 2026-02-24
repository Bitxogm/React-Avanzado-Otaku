import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

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
      description:
        "Desarrollar versión nativa para iOS y Android usando React Native.",
    },
    {
      title: "API Rate Limiting",
      description:
        "Implementar rate limiting y throttling para proteger contra ataques.",
    },
    {
      title: "Dark Mode Support",
      description:
        "Agregar tema oscuro con sincronización de preferencias del usuario.",
    },
  ];

  // Limpiar proyectos existentes primero (opcional)
  await prisma.project.deleteMany({});

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
    console.error("❌ Error en seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
