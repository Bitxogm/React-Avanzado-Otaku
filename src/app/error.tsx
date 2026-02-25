"use client"; // Error boundaries MUST be Client Components

import { useEffect } from "react";

/**
 * COMPONENTE GLOBAL DE ERROR ("Las Matrioshkas")
 * Este componente DEBE ser "use client" obligatoriamente porque los errores
 * pueden ocurrir tanto en el renderizado inicial del servidor como durante
 * la interacción del usuario en el navegador.
 * 
 * Atrapa cualquier error no controlado que ocurra en cualquier hijo (páginas, layouts).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  // Puedes usar un useEffect para enviar el log de error a un servicio externo (Sentry, Datadog)
  useEffect(() => {
    // Aquí registraríamos el error en producción
    console.error("⚠️ Error capturado por el boundary global:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="space-y-6 max-w-lg p-8 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 rounded-2xl shadow-sm">

        <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          ¡Algo salió mal!
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Nuestros servidores encontraron un error inesperado. Hemos registrado el incidente para solucionarlo.
        </p>

        {/* En desarrollo, mostramos el mensaje de error real. En producción se suele ocultar por seguridad */}
        <div className="mt-4 p-4 bg-white dark:bg-black rounded border border-red-100 dark:border-red-800 text-left overflow-auto text-xs text-red-800 dark:text-red-400 font-mono">
          {error.message || "Error interno del servidor"}
        </div>

        <div className="pt-4">
          <button
            // La función 'reset' intenta re-renderizar el segmento por completo.
            // Si fue un fallo de red temporal con la BD, esto lo arreglará mágicamente.
            onClick={() => reset()}
            className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all duration-200"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
