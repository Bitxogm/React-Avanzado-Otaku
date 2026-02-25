/**
 * "use client" es obligatorio para cualquier componente que use:
 * - Eventos del DOM (onClick, onChange...)
 * - Hooks de estado o ciclo de vida de React (useState, useEffect...)
 * - APIs exclusivas del navegador (window, document, localStorage...)
 */
"use client";

import { useTheme } from "../hooks/use-theme";

/**
 * Componente que muestra un botón para alternar entre el modo Dark y Light.
 */
export default function ThemeToggle() {
  // Llamamos a nuestro hook personalizado que encapsula la lógica del tema
  const { theme, toggleTheme, mounted } = useTheme();

  // 🐛 EVITAR HYDRATION MISMATCH
  // Cuando Next.js renderiza la primera vez en el servidor, no sabe qué tema tiene el usuario en su LocalStorage.
  // Por lo tanto, esperamos a que el componente se "monte" en el navegador (mounted = true)
  // antes de mostrar el botón final. Mientras tanto, mostramos un "Loading...".
  if (!mounted) {
    return (
      <div className="mt-8 px-4 py-2 bg-gray-600 text-white rounded text-center opacity-50 cursor-wait">
        Cargando...
      </div>
    )
  }

  // Una vez que sabemos el tema real del usuario, mostramos el botón funcional
  return (
    <button
      onClick={toggleTheme} // Al hacer clic, se ejecuta la función que cambia el estado
      className="mt-8 px-4 py-2 w-full bg-gray-600 hover:bg-gray-500 font-medium text-white rounded transition-colors active:scale-95"
    >
      {/* Operador ternario para cambiar el texto según el estado 'theme' */}
      Tema: {theme === "light" ? "Claro ☀️" : "Oscuro 🌙"}
    </button>
  );
}
