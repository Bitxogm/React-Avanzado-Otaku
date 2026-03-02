/**
 * Este archivo define los tipos e interfaces de datos relacionados con PROYECTOS.
 * Aquí centralizamos todos los tipos TypeScript para evitar duplicaciones y mantener
 * coherencia en toda la aplicación (frontend, backend, base de datos).
 */

/**
 * Interfaz DTO (Data Transfer Object) que representa un Proyecto completo.
 * Utilizado para transferir datos entre el servidor (Prisma) y el cliente (React).
 * Los DTOs nos permiten exponer solo los campos que queremos al frontend, ocultando datos sensibles.
 */
export interface ProjectDto {
  id: number; // Identificador único de la base de datos
  title: string; // Título/nombre del proyecto
  description: string; // Descripción detallada del proyecto
  likes: number; // Contador de "Me gusta" (likes)
  userId: string; // Identificador del usuario propietario
  createdAt: Date; // Fecha de creación en la base de datos
  updatedAt: Date; // Última fecha de modificación
}
