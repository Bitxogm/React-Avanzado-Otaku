/**
 * SCRIPT DE SEEDING (Población de datos)
 * Se encarga de llenar la Base de Datos vacía con información útil inicial (mock data)
 * para que no tengas que crear proyectos manualmente al iniciar la aplicación.
 */
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import readline from "readline";
import { createHash } from "crypto";

const { PrismaClient } = pkg;

// Al ser un script externo suelto (no ejecutado por Next.js), cargamos la variable manualmente
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Configuración de Prisma igual que en el entorno normal (ver src/lib/prisma.ts)
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

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

  // Limpiar proyectos (sin confirmación en desarrollo)
  console.log("⚠️  Borrando todos los proyectos existentes...");

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
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
