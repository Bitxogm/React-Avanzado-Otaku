import Link from "next/link";

/**
 * Interfaz que define las propiedades (props) que espera recibir este componente.
 * TypeScript nos ayuda a evitar errores comprobando que siempre le pasemos los datos correctos.
 */
interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Función auxiliar para formatear las fechas de la Base de Datos a un formato legible en español
function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    minute: "2-digit",
    hour: "2-digit",
  });
}

/**
 * Componente que muestra la tarjeta visual de un proyecto.
 * Es un Server Component por defecto (no tiene "use client").
 */
export default function ProjectCard(project: ProjectCardProps) {
  return (
    <div className="flex">

      {/* Contenedor principal de la tarjeta con clases utilitarias de TailwindCSS */}
      <article className="bg-gray-800 border border-gray-600 p-4 rounded mb-4 flex-1 shadow-md">
        <h2 className="text-xl font-bold text-blue-300">{project.title}</h2>
        <p className="text-gray-300 mt-1">{project.description}</p>
        <p className="text-sm text-gray-500 mt-4">
          Creado: {formatDate(project.createdAt)} | Actualizado:{" "}
          {formatDate(project.updatedAt)}
        </p>
      </article>

      {/* 
        Link dinámico hacia la página de detalles del proyecto.
        Usamos "Template Literals" (comillas invertidas ` `) para insertar la variable ID en la URL.
      */}
      <Link href={`/dashboard/${project.id}`} className="ml-4 self-center px-4 py-2 bg-blue-600 font-bold text-white rounded hover:bg-blue-700 transition-colors shadow hover:shadow-lg active:scale-95">
        Ver detalles
      </Link>
    </div>
  );
}
