/**
 * "use client" convierte este archivo (y a quien lo importe) en un entorno de navegador.
 * Los hooks nativos de React (useState, useEffect) y el acceso a variables 
 * como `window` y `document` solo existen en el cliente (Browser).
 */
"use client";

import { useEffect, useState } from "react";

// Tipado estricto
type Theme = "light" | "dark";

/**
 * Hook personalizado (Custom Hook) para manejar el tema Claro/Oscuro en Next.js con TailwindCSS.
 */
export function useTheme() {
  // Estado local que guarda el tema actual y un booleano para saber si el componente ya se montó en cliente
  const [state, setState] = useState<{ theme: Theme; mounted: boolean }>({
    theme: "light",
    mounted: false,
  });

  // useEffect se ejecuta una sola vez cuando el componente se renderiza en el cliente por primera vez
  useEffect(() => {
    // Detecta si el Sistema Operativo del usuario está en modo oscuro (Windows/Mac/Android)
    function getSystemTheme(): Theme {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Lee la preferencia guardada en el navegador por visitas anteriores
    function getStoredTheme(): Theme | null {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme !== "light" && storedTheme !== "dark") return null;
      return storedTheme;
    }

    function applyTheme(nextTheme: Theme) {
      // Agrega/Quita la clase "dark" a la etiqueta <html> superior.
      // TailwindCSS escucha esta clase para activar los estilos `dark:bg-black`, etc.
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      document.documentElement.style.colorScheme = nextTheme;
      localStorage.setItem("theme", nextTheme); // Persistimos en LocalStorage
    }

    // Priorizamos la opción guardada por el usuario, si no hay, la del SO
    const initialTheme = getStoredTheme() ?? getSystemTheme();

    applyTheme(initialTheme);

    // Pequeño timeout para informar a React que terminamos el montaje inicial y puede mostrar UI real
    const timeoutId = setTimeout(() => {
      setState({ theme: initialTheme, mounted: true });
    }, 0);

    return () => clearTimeout(timeoutId); // Limpieza estándar de useEffect
  }, []);

  function applyTheme(nextTheme: Theme) {
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  }

  // Función que el botón Click llamará para cambiar al tema contrario
  const toggleTheme = () => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    applyTheme(newTheme);
    setState((prev) => ({ ...prev, theme: newTheme })); // Actualiza todo el bloque de interfaz que use el Hook
  };

  // Exportamos los datos valiosos para ser usados por cualquier UI (ej. el ThemeToggle)
  return { theme: state.theme, toggleTheme, mounted: state.mounted };
}
