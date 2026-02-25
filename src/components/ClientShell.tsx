/**
 * "use client" crea un límite ("Boundary") entre el servidor y el cliente.
 * Todos los componentes que importes DESDE AQUÍ y sus hijos se convertirán
 * en componentes de cliente... EXCEPTO si pasas un Server Component como un 'children'.
 * Este es un patrón muy poderoso en Next.js (composición).
 */
"use client"

interface ClientShellProps {
  children: React.ReactNode; // ReactNode permite recibir cualquier elemento React válido
}

export default function ClientShell({ children }: ClientShellProps) {
  // Este <div> se "hidrata" (carga su interactividad Javascript) en el cliente Web,
  // pero el contenido de 'children' (UserProfile) ya vendrá con el HTML 100% renderizado desde el servidor.
  return <div className="mt-4 px-4 py-4 bg-gray-700 text-white rounded shadow-inner">
    <h3 className="font-bold mb-2 text-sm text-gray-300 uppercase tracking-widest">
      Client Shell (Wrapper)
    </h3>

    {/* Aquí insertamos el componente hijo */}
    {children}

  </div>;

}