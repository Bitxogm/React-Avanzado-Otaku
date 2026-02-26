/**
 * page.tsx en la raíz de la carpeta 'app' representa la página de inicio (ruta '/').
 * En el App Router de Next.js, cada carpeta define un segmento de la URL,
 * y el archivo page.tsx es el componente React que se muestra para esa ruta.
 */
export const dynamic = 'force-static';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* Aquí iría el contenido principal de tu página de inicio */}
    </div>
  );
}
