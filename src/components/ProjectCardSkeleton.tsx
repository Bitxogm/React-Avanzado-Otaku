/**
 * Componente Skeleton (Esqueleto).
 * Se usa para mostrar una versión "fantasma" de la tarjeta del proyecto 
 * mientras los datos reales se están cargando desde la base de datos (mejora la UX).
 * Es un patrón muy común cuando usamos "Suspense" en React/Next.js.
 */
export default function ProjectCardSkeleton() {
  return (
    <article className="p-4 rounded mb-4">
      {/* 
        "animate-pulse" es una clase mágica de Tailwind que hace que el <div> 
        parpadee suavemente, creando la sensación visual de que algo está cargando.
      */}

      {/* Simula la forma geométrica del título del proyecto */}
      <div className="h-6 w-2/3 animate-pulse bg-gray-200 dark:bg-gray-700" />

      {/* Simula las líneas de texto de la descripción del proyecto */}
      <div className="mt-3 h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-700" />

      {/* Simula la zona de la fecha del proyecto */}
      <div className="mt-2 h-4 w-1/3 animate-pulse bg-gray-200 dark:bg-gray-700" />
    </article>
  );
}
