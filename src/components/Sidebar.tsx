// Link permite navegación súper rápida sin recargar la página completa (precarga el código HTML y JS de la ruta destino)
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import ClientShell from "./ClientShell";
import UserProfile from "./Userprofile";

/**
 * Sidebar es la barra lateral de navegación principal del sitio.
 * Al NO tener "use client" arriba, Next.js asume que es un Server Component por defecto.
 */
export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Menú</h2>

      {/* Navegación usando Tailwind CSS para los estilos */}
      <nav className="flex flex-col gap-2">
        <Link href="/" className="p-2 hover:bg-gray-700 rounded transition-colors">
          Home
        </Link>
        <Link href="/dashboard" className="p-2 hover:bg-gray-700 rounded transition-colors">
          Dashboard
        </Link>
        <Link href="/login" className="p-2 hover:bg-gray-700 rounded transition-colors">
          Login
        </Link>
      </nav>

      {/* ThemeToggle necesita 'use client' internamente porque maneja un botón interactivo (onClick) y estado (useState) */}
      <ThemeToggle />

      {/* 
        ClientShell parece ser un "wrapper" (envoltorio) del lado del cliente.
        Esto es un patrón muy común cuando queremos pasar un Server Component (UserProfile)
        como children a un Client Component (ClientShell). 
      */}
      <ClientShell>
        <UserProfile />
      </ClientShell>
    </aside>
  );
}
