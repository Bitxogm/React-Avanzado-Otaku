/**
 * La directiva "use server" le indica a Next.js que todas las funciones exportadas en este archivo
 * son "Server Actions" (Acciones de Servidor).
 * Las Server Actions son funciones asíncronas que se ejecutan EXCLUSIVAMENTE en el servidor.
 * La magia es que puedes llamarlas directamente desde interactividad del lado del cliente (Client Components)
 * o desde un formulario nativo de HTML, y Next.js se encarga de crear el endpoint oculto.
 */
"use server";

import { createProject } from "@/lib/projects";
// revalidatePath es clave en Next.js. Permite purgar o limpiar la caché de una ruta específica
// para que Next.js actualice los datos que muestra en pantalla tras un cambio
import { revalidatePath } from "next/cache";
import { z } from "zod"; // Zod es una librería muy popular para validar esquemas de datos
import { createProjectSchema } from '../../../schemas/project.schema';

// Esta interfaz define un molde para la respuesta estándar de nuestras Server Actions
export interface ProjectActionResult {
  success: boolean;       // Indica si la acción fue exitosa o falló
  message: string;        // Mensaje de feedback para el usuario
  requestId: number;      // Un identificador único (aquí usamos Date.now())
  errors?: Record<string, string[]>; // Mapa de posibles errores de validación
}

/**
 * Acción de servidor sencilla para crear un proyecto.
 * Su primer parámetro "oculto" (_previousState) sirve cuando encadenamos
 * la acción con el hook "useActionState" de React en el cliente.
 */
export async function createProjectAction(
  _previousState: ProjectActionResult, // Estado que devolvió la acción en la llamada anterior
  formData: FormData, // Los datos enviados a través de un <form> HTML estándar
): Promise<ProjectActionResult> {
  // Extraemos el campo title del formulario
  const title = String(formData.get("title")).trim();

  // Validación básica manual (comprobar que no esté vacío)
  if (!title) {
    return {
      success: false,
      message: "El título del proyecto es obligatorio",
      requestId: Date.now(),
    };
  }

  try {
    // Si todo es correcto, guardamos el proyecto en la base de datos
    const newProject = await createProject(title);

    // Este log saldrá en tu terminal de backend, no en el Google Chrome
    console.log("Nuevo proyecto creado:", newProject);

    // !! IMPORTANTE !!
    // Como creamos un proyecto nuevo, la ruta /dashboard estará desactualizada.
    // Usamos revalidatePath para obligar a Next.js a hacer un "refetch" interno de
    // los Server Components en la ruta /dashboard y mostrar el nuevo proyecto al instante.
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Proyecto creado exitosamente",
      requestId: Date.now(),
    };
  } catch {
    console.error("[createProjectAction] Error al crear el proyecto");
    return {
      success: false,
      message: "Error al crear el proyecto",
      requestId: Date.now(),
    };
  }
}

/**
 * Función auxiliar para "traducir" el formato complejo de errores de Zod
 * a un objeto plano fácil de leer y utilizar en el Frontend.
 */
function getFieldErrorsFromTree(
  error: z.ZodError<z.infer<typeof createProjectSchema>>,
): Record<string, string[]> {
  const tree = z.treeifyError(error);
  const fieldErrors: Record<string, string[]> = {};

  for (const [fieldName, node] of Object.entries(tree.properties ?? {})) {
    if (node?.errors.length) {
      fieldErrors[fieldName] = node.errors;
    }
  }

  return fieldErrors;
}

/**
 * Acción de servidor avanzada usando Zod para validar campos y Description.
 * Esta acción está pensada para integrarse con un flujo "Optimista" en Frontend.
 */
export async function createProjectOptimisticAction(
  _previousState: ProjectActionResult,
  formData: FormData,
): Promise<ProjectActionResult> {
  // Verificamos de forma segura (*safeParse*) que los datos coincidan con nuestras reglas de Zod
  const validatedFields = createProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  // Si la validación en servidor falla, retornamos el error estructurado
  if (!validatedFields.success) {
    return {
      success: false,
      message:
        "Hay errores en el formulario. Por favor corrígelos e intenta de nuevo.",
      requestId: Date.now(),
      errors: getFieldErrorsFromTree(validatedFields.error),
    };
  }

  try {
    // validatedFields.data solo es accesible si success es true gracias a TypeScript
    const newProjectData = validatedFields.data;
    const newProject = await createProject(
      newProjectData.title,
      newProjectData.description,
    );
    console.log("Nuevo proyecto creado:", newProject);

    // Purgamos la caché de dashboard
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Proyecto creado exitosamente",
      requestId: Date.now(),
    };
  } catch {
    console.error("[createProjectAction] Error al crear el proyecto");
    return {
      success: false,
      message: "Error al crear el proyecto",
      requestId: Date.now(),
    };
  }
}
