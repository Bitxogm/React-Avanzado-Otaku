/**
 * Formulario de login con Server Actions usando `useActionState` y validaciones del backend.
 * Este componente requiere "use client" porque:
 * - Usa React Hooks (useState, useEffect, useActionState)
 * - Usa useRouter para la navegación del cliente
 * - Maneja eventos interactivos (onChange en inputs)
 */
"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/login/actions";
import { initialLoginState } from "@/app/login/types";

/**
 * Props del componente LoginForm.
 */
type LoginFormProps = {
  from: string; // URL de redirección después del login exitoso
};

/**
 * Función auxiliar que genera clases de CSS para inputs dependiendo de si tienen errores.
 * Si hay error, muestra border rojo y focus ring rojo. Si no hay error, usa los estilos normales.
 */
function getInputClassName(hasError: boolean) {
  return [
    "w-full rounded border bg-background px-3 py-2 text-sm",
    hasError
      ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
      : "border-border",
  ].join(" ");
}

/**
 * Componente LoginForm que renderiza un formulario de autenticación.
 * Utiliza useActionState para integrar la Server Action loginAction que valida
 * email y contraseña en el backend (Zod + Prisma).
 */
export default function LoginForm({ from }: LoginFormProps) {
  // Router para redirigir al dashboard después del login exitoso
  const router = useRouter();

  // useActionState vincula el formulario con la Server Action del backend
  const [state, formAction] = useActionState(loginAction, initialLoginState);

  // Estado local para el campo de contraseña
  const [password, setPassword] = useState("");

  // Fallback por si state es null (caso muy raro)
  const safeState = state ?? initialLoginState;

  /**
   * Efecto que realiza la redirección al dashboard cuando el login es exitoso.
   * Espera 300ms para permitir que el usuario vea el mensaje de éxito antes de navegar.
   */
  useEffect(() => {
    console.log("[LoginForm] useEffect - state.success:", safeState.success);
    if (safeState.success) {
      console.log("[LoginForm] ✅ Login exitoso, esperando 300ms...");
      const timer = setTimeout(() => {
        console.log("[LoginForm] 🚀 Redirigiendo a /dashboard");
        router.push("/dashboard");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [safeState.success, router]);

  return (
    <form action={formAction} className="rounded-lg border border-border bg-card p-6 space-y-4">
      {/* <input type="hidden" name="from" value={from} /> */}

      {/* Campo de Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={safeState.values.email}
          placeholder="admin@marketplace.com"
          className={getInputClassName(Boolean(safeState.errors.email?.length))}
        />
        {/* Mostrar error específico del campo email si existe */}
        {safeState.errors.email?.[0] ? (
          <p className="text-xs text-red-600 dark:text-red-400">{safeState.errors.email[0]}</p>
        ) : null}
      </div>

      {/* Campo de Contraseña */}
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-semibold">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="1234"
          className={getInputClassName(Boolean(safeState.errors.password?.length))}
        />
        {/* Mostrar error específico del campo password si existe */}
        {safeState.errors.password?.[0] ? (
          <p className="text-xs text-red-600 dark:text-red-400">
            {safeState.errors.password[0]}
          </p>
        ) : null}
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Iniciar sesion
      </button>

      {/* Mensaje de feedback (éxito o error general) del servidor */}
      {safeState.message ? (
        <p className={`text-sm ${safeState.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {safeState.message}
        </p>
      ) : null}
    </form>
  );
}
