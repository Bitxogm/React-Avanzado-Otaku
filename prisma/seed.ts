import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createHash } from "crypto";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  // Limpiar usuarios existentes
  await prisma.user.deleteMany({});
  console.log("🗑️  Usuarios eliminados");

  // Crear usuarios de prueba
  const testUsers = [
    {
      email: "admin@marketplace.com",
      password: hashPassword("1234"),
      name: "Admin User",
    },
    {
      email: "user@marketplace.com",
      password: hashPassword("password123"),
      name: "Test User",
    },
  ];

  // Crear nuevos usuarios y obtener el primer ID
  let adminUserId = "";
  for (const userData of testUsers) {
    const newUser = await prisma.user.create({ data: userData });
    if (!adminUserId) {
      adminUserId = newUser.id;
    }
    console.log(`✅ Usuario creado: ${userData.email}`);
  }

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

  // Limpiar proyectos existentes
  const deleted = await prisma.project.deleteMany({});
  console.log(`🗑️  Se borraron ${deleted.count} proyectos`);

  // Crear nuevos proyectos con userId
  let projectCount = 0;
  for (const projectData of projects) {
    await prisma.project.create({
      data: {
        ...projectData,
        userId: adminUserId,
      },
    });
    projectCount++;
  }

  console.log(`✅ Seed completado: Se crearon ${projectCount} proyectos`);
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
