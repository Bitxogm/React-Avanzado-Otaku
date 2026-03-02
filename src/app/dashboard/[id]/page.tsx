import OptimisticLikeButton from "@/components/buttons/optimistic-like-button";
import { getProjectById, getProjects } from "@/lib/projects";
import { getSession } from "@/lib/auth";
// import { ProjectDto } from "@/lib/projects.types";
import { Metadata } from "next";

//  Fuerza a Next.js a renderizar esta página en el servidor en cada petición, desactivando la generación estática.
export const dynamic = "force-dynamic";

// Definimos el tipo de los parámetros dinámicos de la URL (el "[id]" de la carpeta)
type ProjectDetailParams = Promise<{
  id: string;
}>;

/**
 * generateStaticParams se ejecuta durante el "build time" (cuando haces npm run build).
 * Sirve para decirle a Next.js qué IDs de proyectos existen de antemano.
 * Así, Next.js puede pre-renderizar estáticamente todas las páginas de detalles de proyectos.
 * Es excelente para el rendimiento (Static Site Generation - SSG).
 */
export async function generateStaticParams() {
  const projects = await getProjects({ order: "asc" });

  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

/**
 * generateMetadata permite generar las etiquetas <title> y <meta> dinámicamente
 * dependiendo del proyecto que estemos viendo (útil para SEO cuando se comparte el enlace a alguien).
 */
export async function generateMetadata(props: {
  params: ProjectDetailParams;
}): Promise<Metadata> {
  const { id } = await props.params;

  // Validar que el ID sea un número válido
  const numericId = Number(id);
  if (isNaN(numericId)) {
    throw new Error(`ID de proyecto inválido: ${id}`);
  }

  // Buscamos el proyecto en la base de datos
  const project = await getProjectById(numericId);

  // Retornamos el título del proyecto o un texto por defecto si no existe
  return {
    title: project ? `Proyecto: ${project.title}` : "Proyecto no encontrado",
    description: project
      ? `Detalles del proyecto ${project.title}`
      : "No se encontró el proyecto",
  };
}

/**
 * ProjectDetail es un Server Component que representa la página de detalles de un solo proyecto.
 * La carpeta "[id]" indica que es una ruta dinámica (ej: /dashboard/1, /dashboard/25).
 */
export default async function ProjectDetail(props: {
  params: ProjectDetailParams;
}) {
  // Obtener la sesión del usuario
  const session = await getSession();
  if (!session) {
    return <div>No estás autenticado</div>;
  }

  // Extraemos el ID dinámico de la URL
  const { id } = await props.params;

  console.log("ID del proyecto:", id);

  // Validar que el ID sea un número válido
  const numericId = Number(id);
  if (isNaN(numericId)) {
    throw new Error(`ID de proyecto inválido: ${id}`);
  }

  // Obtenemos los detalles únicos de este proyecto por su ID particular
  const project = await getProjectById(numericId);

  // Manejo básico de error si alguien entra a /dashboard/9999 y no existe
  if (!project) {
    throw new Error(`Proyecto con ID ${numericId} no encontrado`);
  }

  // Verificar que el proyecto pertenece al usuario actual
  if (project.userId !== session.userId) {
    throw new Error(`No tienes permiso para ver este proyecto`);
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">{project.title}</h2>
      <p>{project.description}</p>
      <div>
        {/* Usamos un Client Component para manejar la interactividad del botón de "Me gusta" */}
        <OptimisticLikeButton
          initialLikes={project.likes}
          projectId={project.id}
        />
      </div>
    </div>
  );
}
