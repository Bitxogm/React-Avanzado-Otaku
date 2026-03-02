/**
 * Este archivo concentra toda la Lógica de Negocio (CRUD) de la entidad "Proyecto".
 * Aquí escribimos en código Typescript las consultas a la base de datos usando `prisma`.
 * ESTE CÓDIGO SE EJECUTA SIEMPRE EN EL BACKEND EXCLUSIVAMENTE.
 */
import { Project } from "@prisma/client";
import prisma from "./prisma"; // Importamos el cliente que configuramos en prisma.ts
import { ProjectDto } from "./projects.types";

interface ProjectFilter {
  order: "asc" | "desc"; // Forzamos por TypeScript a que el orden sea limitado a "asc" o "desc"
  userId?: string; // Opcional: si no se proporciona, devuelve todos los proyectos
}

/* -------------------------------------------------------------------------- */
/*                                SECCIÓN LECTURA                             */
/* -------------------------------------------------------------------------- */

/**
 * Función (Query) que trae un array de múltiples proyectos desde la BD.
 */
export async function getProjects({
  order,
  userId,
}: ProjectFilter): Promise<Project[]> {
  console.log(`[getProjects] Obteniendo proyectos con orden: ${order}`);

  // prisma.project hace referencia a la tabla 'Project' en tu DB.
  return prisma.project.findMany({
    where: userId ? { userId } : undefined, // Filtrar por usuario solo si se proporciona
    orderBy: {
      createdAt: order, // 'asc' ordena viejos primero, 'desc' ordena nuevos primero
    },
  });
}

/**
 * Función que busca LOS DATOS DE UN ÚNICO proyecto usando su identificador real de base de datos.
 * Puede retornar null si el ID pasó por la URL y era inventado.
 */
export async function getProjectById(id: number): Promise<ProjectDto | null> {
  return prisma.project.findUnique({
    where: {
      id, // Esto es equivalente a SQL: WHERE id = x
    },
    // select sirve para traer SOLO columnas específicas (optimiza el tráfico de la DB si tienes millones de campos)
    select: {
      id: true,
      title: true,
      description: true,
      likes: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                              SECCIÓN ESCRITURA                             */
/* -------------------------------------------------------------------------- */

/**
 * Función (Mutation) para insertar una nueva fila en la tabla de proyectos.
 */
export async function createProject(
  title: string,
  userId: string,
  description?: string, // Campo opcional
): Promise<Project> {
  return prisma.project.create({
    data: {
      title,
      description: description || "autogenerado", // Se le da un fallback por si llega vacío o undefined
      userId,
    },
  });
}

/**
 * Incrementa de forma matemática los Me Gusta (+1).
 */
export async function incrementProjectLikes(
  projectId: number,
): Promise<number> {
  // 1. Prisma realiza la instrucción atómica (protegida contra condiciones de carrera)
  await prisma.project.update({
    where: { id: projectId },
    data: {
      likes: {
        increment: 1, // Le pide a la base de datos "sumate +1 ti misma" en lugar de mandarlo de acá
      },
    },
  });

  // 2. Traemos el nuevo número que quedó en la BD
  const updated = await prisma.project.findUnique({
    where: { id: projectId },
  });

  return updated?.likes ?? 0;
}

export async function deleteProject(
  projectId: number,
  userId: string,
): Promise<boolean> {
  const projectDb = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, userId: true },
  });

  // Verificar que el proyecto existe y pertenece al usuario
  if (!projectDb || projectDb.userId !== userId) {
    return false;
  }

  await prisma.project.delete({ where: { id: projectDb.id } });

  return true;
}
