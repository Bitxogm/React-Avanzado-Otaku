"use server"; // Indica que TODAS las funciones de este archivo corren exclusivamente en el backend

import { incrementProjectLikes } from "@/lib/projects";
import { revalidatePath } from "next/cache";

/**
 * Esta Server Action se usa para incrementar los "Me gusta" de un proyecto.
 * Puede ser llamada directamente desde un botón (On Click) en un Client Component.
 */
export async function incrementProjectLikesAction(
  projectId: number,
): Promise<number> {
  // Simulamos un retraso artificial de 2 segundos (útil para testear "UI Optimista")
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Llamada real a la base de datos para subir el contador
  const updatedLikes = await incrementProjectLikes(projectId);

  // Le pedimos a Next.js que re-genere la página de detalle en el backend
  // así los siguientes visitantes verán los datos actualizados de inmediato
  revalidatePath(`/dashboard/projects/${projectId}`);

  // Retornamos la nueva cantidad de likes al cliente
  return updatedLikes;
}
