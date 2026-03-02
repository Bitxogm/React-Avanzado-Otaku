/**
 * Botón que elimina un proyecto específico mediante una Server Action.
 * Utiliza un formulario HTML tradicional para pasar el ID del proyecto al backend.
 * No necesita "use client" porque el formulario es completamente nativo de HTML.
 */
import { deleteProjectAction } from "@/app/dashboard/actions";

/**
 * Props que define el ID del proyecto a eliminar.
 */
interface DeleteProjectButtonProps {
  projectId: number
}

/**
 * Componente que renderiza un botón de eliminar proyecto.
 * Al hacer clic, envía un formulario con la Server Action deleteProjectAction
 * y el ID del proyecto como campo oculto (input hidden).
 */
export default function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  return (
    <form action={deleteProjectAction}>
      {/* Campo oculto que envía el ID del proyecto al servidor */}
      <input type="hidden" name="projectId" value={projectId} />

      {/* Botón de envío con estilos destructivos (rojo) para indicar peligro */}
      <button type="submit" className="rounded bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
        Borrar
      </button>
    </form>
  )
}