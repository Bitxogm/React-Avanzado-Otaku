/**
 * Este archivo define los tipos e interfaces de datos relacionados con USUARIOS.
 * Aquí centralizamos todos los tipos TypeScript para mantener coherencia
 * en toda la aplicación (autenticación, permisos, perfiles, etc).
 */

/**
 * Interfaz DTO (Data Transfer Object) que representa un Usuario.
 * Exportamos solo los campos públicos/seguros (id y email).
 * Nunca exponemos el password por seguridad, aunque esté en la base de datos de Prisma.
 */
export interface UserDto {
  id: string; // Identificador único del usuario (UUID o similar)
  email: string; // Email único del usuario para login y comunicación
}
