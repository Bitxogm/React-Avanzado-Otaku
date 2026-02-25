/**
 * "use client" es esencial aquí. Convierte este archivo en un "Client Component" (Componente de Cliente).
 * Lo necesitamos porque vamos a usar interactividad en el navegador (eventos como onClick) 
 * y hooks de React/Next.js (`useRouter`) que dependen del navegador ("window").
 */
"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  // useRouter es un hook de Next.js que nos permite navegar mediante código sin usar la etiqueta <Link>
  const router = useRouter();

  // Función manejadora para el evento de click (interactividad)
  const handleLogin = () => {
    // Simulamos un login muy básico escribiendo una cookie directamente en el navegador
    document.cookie = "token=; path=/; max-age=3600;";

    // Redirigimos al usuario a la ruta protegida /dashboard programáticamente
    router.push("/dashboard");
  }

  const handleLogout = () => {
    // Simulamos cerrar sesión borrando la cookie (poniendo su fecha de expiración en el pasado)
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    // router.refresh() le dice a Next.js que re-renderice la ruta actual en el servidor y actualice la pantalla
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      <p className="text-lg text-gray-600">Bienvenido al login</p>
      {/* 
        Estos botones usan onClick. Si quitaras el "use client" de arriba, 
        Next.js lanzaría un error porque los Server Components no pueden tener interactividad (onClick). 
      */}
      <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Iniciar Sesión</button>
      <button onClick={handleLogout} className="mt-4 ml-4 px-4 py-2 bg-gray-600 text-white rounded">Cerrar sesión</button>
    </div>
  )
}
