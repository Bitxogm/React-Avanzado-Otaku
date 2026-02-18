"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const handleLogin = () => {
    document.cookie = "token=; path=/; max-age=3600;";
    router.push("/dashboard");
  }

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      <p className="text-lg text-gray-600">Bienvenido al login</p>
      <button onClick={handleLogin} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Iniciar Sesión</button>
      <button onClick={handleLogout} className="mt-4 ml-4 px-4 py-2 bg-gray-600 text-white rounded">Cerrar sesión</button>
    </div>
  )
}
