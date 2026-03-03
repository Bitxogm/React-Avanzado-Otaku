/**
 * Este archivo concentra toda la Lógica de Negocio (CRUD) de la entidad "Proyecto".
 * Aquí escribimos en código Typescript las consultas a la base de datos usando `prisma`.
 * ESTE CÓDIGO SE EJECUTA SIEMPRE EN EL BACKEND EXCLUSIVAMENTE.
 */
import { Project } from "@prisma/client";
import prisma from "./prisma"; // Importamos el cliente que configuramos en prisma.ts
import { ProjectDto } from "./projects.types";

/**
 * Interfaz que define los parámetros de filtrado y paginación para proyectos.
 */
interface ProjectFilter {
  order: "asc" | "desc"; // Forzamos por TypeScript a que el orden sea limitado a "asc" o "desc"
  userId?: string; // Opcional: si no se proporciona, devuelve todos los proyectos
  query?: string; // Búsqueda por título o descripción
  page?: number; // Número de página (comienza en 1)
  pageSize?: number; // Cantidad de proyectos por página
}

/**
 * Interfaz que define la estructura de respuesta paginada de proyectos.
 */
interface PaginatedProjectsResult {
  items: Project[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

/* -------------------------------------------------------------------------- */
/*                                SECCIÓN LECTURA                             */
/* -------------------------------------------------------------------------- */

/**
 * Función (Query) que trae múltiples proyectos desde la BD con soporte para:
 * - Búsqueda por query (título o descripción)
 * - Paginación (page y pageSize)
 * - Ordenamiento (asc/desc)
 * - Filtrado por usuario (userId)
 *
 * Retorna un objeto con la lista de proyectos y metadatos de paginación.
 */
export async function getProjects({
  order,
  userId,
  query,
  page = 1,
  pageSize = 10,
}: ProjectFilter): Promise<PaginatedProjectsResult> {
  console.log(
    `[getProjects] Obteniendo proyectos - query: ${query}, page: ${page}, pageSize: ${pageSize}`,
  );

  // ✅ Proteger page: debe ser número válido y >= 1
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;

  // ✅ Proteger pageSize: debe ser número válido y >= 1
  const safePageSize = Number.isNaN(pageSize) || pageSize < 1 ? 10 : pageSize;

  // Construir el filtro WHERE dinámicamente
  const whereClause = {
    ...(userId && { userId }), // Filtro por usuario si se proporciona
    ...(query && {
      // Búsqueda por título O descripción (usando OR)
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
      ],
    }),
  };

  // Obtener el total de proyectos que cumplen los filtros
  const totalItems = await prisma.project.count({
    where: whereClause,
  });

  // Calcular el número total de páginas (nunca menor a 1)
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));

  // ✅ Asegurar que la página actual no sea mayor que el total de páginas
  const currentPage = Math.min(safePage, totalPages);

  // Calcular el offset para la paginación
  const skip = (currentPage - 1) * safePageSize;

  // Obtener los proyectos de la página actual
  const items = await prisma.project.findMany({
    where: whereClause,
    orderBy: {
      createdAt: order, // 'asc' ordena viejos primero, 'desc' ordena nuevos primero
    },
    skip, // Saltamos los primeros (currentPage - 1) * safePageSize registros
    take: safePageSize, // Tomamos solo safePageSize registros
  });

  console.log(
    `[getProjects] ✅ Obtenidos ${items.length} proyectos de ${totalItems} totales (página ${currentPage}/${totalPages})`,
  );

  return {
    items,
    totalPages,
    currentPage,
    totalItems,
  };
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
