/**
 * Formulario tradicional con Server Actions usando `useActionState`.
 */
"use client";

import { createProjectAction } from "@/app/dashboard/actions";
import CreateProjectButton from "../buttons/create-project-button";
import { useActionState } from "react";

// El estado inicial (vacío) que tendrá el formulario antes de enviarse por primera vez
const initialState = {
  success: false,
  message: "",
  requestId: 0,
};

export default function ProjectForm() {
  // useActionState (antes useFormState) enlaza nuestro Server Action (createProjectAction)
  // con este componente de React. Maneja automáticamente el estado (errores, éxito)
  // devuelto por el servidor sin necesidad de escribir un montón de `useState` y `try/catch`.
  const [state, formAction] = useActionState(createProjectAction, initialState);

  return (
    <form
      action={formAction} // Pasamos la "formAction" generada por el hook
      className="flex flex-col gap-3 border p-4 rounded bg-gray-800"
    >
      <label htmlFor="project-title" className="block text-sm font-semibold text-gray-200">
        Nuevo Proyecto Básico
      </label>
      <input
        id="project-title"
        name="title" // ¡Critico! Este 'name' se usa en el Server Action con formData.get("title")
        type="text"
        placeholder="Ej. Proyecto mutaciones genéticas"
        className="w-full rounded border px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* 
        Este botón, como está dentro de este <form>, enviará los datos. 
        Además, como usa `useFormStatus` internamente de Next.js, 
        sabrá deshabilitarse automáticamente durante la carga.
      */}
      <CreateProjectButton />

      {/* Feedback visual ("Tu proyecto se ha creado", o mensaje de error genérico) */}
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
