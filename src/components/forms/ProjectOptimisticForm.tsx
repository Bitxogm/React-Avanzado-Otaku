/**
 * Formulario Avanzado con Server Actions, Validaciones de Zod (desde el backend) y useActionState.
 */
"use client";

import {
  createProjectOptimisticAction,
  ProjectActionResult,
} from "@/app/dashboard/actions";
import { useActionState } from "react";
import CreateProjectButton from "../buttons/create-project-button";

// Definimos la estructura de estado usando la misma interfaz TypeScript del servidor
const initialState: ProjectActionResult = {
  success: false,
  message: "",
  requestId: 0,
};

export default function ProjectOptimisticForm() {
  // Vinculamos la "Server Action" con nuestro formulario en el Frontend.
  // 'state' contendrá en todo momento la respuesta del servidor (éxitos o errores detallados).
  const [state, formAction] = useActionState(
    createProjectOptimisticAction,
    initialState,
  );

  return (
    <form
      action={formAction} // Pasamos la función manejadora de React como acción nativa de HTML
      className="flex flex-col gap-3 border border-gray-600 bg-gray-800 p-6 rounded shadow-md mt-6"
    >
      <label htmlFor="project-title-adv" className="block text-sm font-semibold text-gray-200 mt-3">
        Nuevo Proyecto Avanzado (con validaciones en el Backend)
      </label>
      <input
        id="project-title-adv"
        name="title" // Mapeado en formData.get("title")
        type="text"
        placeholder="Ej. Proyecto avanzado Next.js"
        className="w-full rounded border border-gray-600 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Mostrar validaciones granulares (campo por campo) devueltas por Zod desde el backend */}
      {state.errors?.title && (
        <p className="text-red-400 text-sm mt-1">{state.errors.title[0]}</p>
      )}

      <input
        id="project-description-adv"
        name="description" // Mapeado en formData.get("description")
        type="text"
        placeholder="Ej. Descripción detallada del proyecto"
        className="w-full rounded border border-gray-600 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
      />

      {/* Mostrar errores específicos para descripción */}
      {state.errors?.description && (
        <p className="text-red-400 text-sm mt-1">
          {state.errors.description[0]}
        </p>
      )}

      <CreateProjectButton />

      {/* Resumen del éxito de la operación (o fallo genérico) */}
      {state.message && (
        <p
          className={`mt-2 text-sm font-bold ${state.success ? "text-green-500" : "text-red-500"
            }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
