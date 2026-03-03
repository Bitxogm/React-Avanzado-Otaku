// Componentes de la UI importados
// import ProjectForm from "@/components/forms/ProjectForm";
import ProjectOptimisticForm from "@/components/forms/ProjectOptimisticForm";
import ProjectCard from "@/components/ProjectCard";

// Funciones para consultas a la base de datos (se ejecutan en el servidor por defecto en el App Router)
import { getProjects } from "@/lib/projects";
import { getSession } from "@/lib/auth";

import { Metadata } from "next";
import { redirect } from "next/navigation"; // Para redirigir al usuario a una URL diferente en el servidor
import Link from "next/link"; // Componente Link de Next.js que optimiza la navegación entre páginas (precarga)
import DashboardFilters from "@/components/forms/DashboardFilters";
import Pagination from "@/components/Pagination"; // Componente de paginación con números de página

// ISR (Incremental Static Regeneration): Fuerza renderizado estático + regenera cada 10 segundos
export const dynamic = 'force-dynamic';

// Tipos para los parámetros de búsqueda de la URL (querystrings como ?sort=desc)
type SearchParamValue = string | string[] | undefined;

// En versiones modernas de Next.js (15+), `searchParams` y `params` son Promesas que debemos resolver
type DashboardPageSearchParams = Promise<Record<string, SearchParamValue>>;

// Metadatos para SEO específicos de esta ruta (aparecen cuando visitas /dashboard)
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard de proyectos",
};

const PAGE_SIZE = 5;

function getSingleSearchParam(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/**
 * DashboardPage es un "Server Component" (Componente de Servidor).
 * Por defecto en Next.js (App Router), todos los componentes son Server Components.
 * Esto significa que su código se ejecuta en el backend usando Node.js,
 * y luego envía solo el HTML resultante al Navegador del usuario, sin enviar el JavaScript de este componente.
 */
export default async function DashboardPage(props: { params: Promise<Record<string, string>>, searchParams: DashboardPageSearchParams }) {
  console.log("\n[Dashboard] ===== RENDERIZANDO DASHBOARD =====");

  const searchParams = await props.searchParams;

  // Extraer y parsear los parámetros de búsqueda de la URL
  const query = getSingleSearchParam(searchParams.query) as string | undefined;
  const order = (getSingleSearchParam(searchParams.order) as "asc" | "desc") || "desc";
  const page = Number(getSingleSearchParam(searchParams.page)) || 1;

  console.log("[Dashboard] Search params:", searchParams);

  // Obtener la sesión del usuario
  console.log("[Dashboard] Verificando sesión...");
  const session = await getSession();

  if (!session) {
    console.log("[Dashboard] ❌ No hay sesión, usuario no autenticado");
    return <div>No estás autenticado</div>;
  }

  console.log("[Dashboard] ✅ Sesión válida, userId:", session.userId);

  // Obtener proyectos con paginación, búsqueda y ordenamiento
  console.log("[Dashboard] Obteniendo proyectos con filtros...");
  const {
    items: projects,
    totalPages,
    currentPage,
    totalItems,
  } = await getProjects({
    query,
    order,
    page,
    pageSize: PAGE_SIZE,
    userId: session.userId,
  });

  console.log(`[Dashboard] ✅ Proyectos obtenidos: ${projects.length} de ${totalItems}`);

  // ✅ Si el usuario solicitó una página inválida (mayor a las disponibles), redirigir a la última página válida
  if (page > totalPages && totalPages > 0) {
    console.log(`[Dashboard] ⚠️ Página ${page} no existe, redirigiendo a página ${totalPages}`);
    redirect(`/dashboard?query=${query || ""}&order=${order}&page=${totalPages}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>
        Bienvenido al dashboard. Si ves esto, es porque tienes la cookie de
        autenticación.
      </p>

      {/* Link sustituye a la etiqueta <a> de HTML para evitar recargas completas de la página */}
      <Link href="/dashboard/form" className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg transition-all cursor-pointer mt-4">
        Ir al formulario
      </Link>

      {/* Componente de filtros para búsqueda y ordenamiento */}
      <DashboardFilters initialQuery={query ?? ""} initialOrder={order} />

      {/* 
        ProjectOptimisticForm es un "Client Component" que se renderiza dentro de este "Server Component".
        Next.js permite esta "arquitectura entrelazada" de forma muy natural.
      */}
      <ProjectOptimisticForm />

      <div className="mt-6">
        {/* Renderizamos una lista iterando sobre el array de proyectos que nos trajo de base de datos */}
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id} // Siempre es obligatorio pasar una 'key' única cuando usamos `.map()` en React
              id={project.id}
              title={project.title}
              description={project.description}
              createdAt={project.createdAt}
              updatedAt={project.updatedAt}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">
            {query ? "No se encontraron proyectos con esa búsqueda" : "No tienes proyectos aún"}
          </p>
        )}
      </div>

      {/* Componente de paginación con números de página */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
