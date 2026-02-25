/**
 * "use client" es indispensable porque este componente emplea un Hook de React (`useFormStatus`).
 * Este componente DEBE ser hijo directo o indirecto de un elemento <form> para funcionar.
 */
"use client";

// Hook de la nueva API de React DOM para manejar formularios asíncronos
import { useFormStatus } from "react-dom";

export default function CreateProjectButton() {
  // `useFormStatus` se comunica con el <form> padre automáticamente y nos dice si se está enviando.
  // Muy útil para aislar la lógica del estado 'loading' sin usar `useState` en todo el formulario.
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 font-bold rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending} // Si se está enviando, deshabilitamos el click
    >
      {/* Feedback visual instantáneo para el usuario */}
      {pending ? "Creando proyecto..." : "Crear Proyecto"}
    </button>
  );
}
