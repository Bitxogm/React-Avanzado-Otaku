import Link from "next/link";
import { headers } from "next/headers";

/**
 * COMPONENTE GLOBAL NOT FOUND (404)
 * Next.js mostrará automáticamente esta página cuando:
 * 1. Un usuario intente acceder a una URL que no existe (ej: /rutafalsa).
 * 2. Llamemos manualmente a la función `notFound()` dentro de cualquier Server Component
 *    (por ejemplo, si buscamos en la BD el proyecto con id 9999 y Prisma devuelve null).
 */
export default async function NotFound() {
  // Opcional: Podemos leer cabeceras para saber qué ruta intentó acceder (avanzado)
  const headersList = await headers();
  const domain = headersList.get("host");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="space-y-6 max-w-lg">
        <h1 className="text-9xl font-extrabold text-blue-600 dark:text-blue-500 tracking-widest drop-shadow-sm">
          404
        </h1>
        <div className="bg-blue-600 px-2 text-sm rounded rotate-12 absolute p-1 text-white select-none">
          Página No Encontrada
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          ¡Ups! Te has perdido en el ciberespacio.
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-400">
          Lo sentimos, no pudimos encontrar la página o el recurso que estabas buscando en <span className="font-semibold">{domain}</span>.
          Es posible que el enlace esté roto o que el contenido haya sido eliminado.
        </p>

        <div className="pt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
          >
            Volver al Dashboard seguro
          </Link>
        </div>
      </div>
    </div>
  );
}
