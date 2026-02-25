/**
 * Botón con "UI Optimista".
 * La técnica optimista consiste en actualizar la interfaz INMEDIATAMENTE al hacer clic,
 * sin esperar a que el servidor (la Base de Datos) responda.
 * Esto proporciona una sensación de velocidad extrema al usuario.
 */
"use client";

import { useOptimistic, useTransition } from "react";
import { incrementProjectLikesAction } from '../../app/dashboard/[id]/actions';

// Propiedades recibidas desde un Server Component (el estado real en BD)
type OptimisticLikeButtonProps = {
  initialLikes: number;
  projectId: number;
};

export default function OptimisticLikeButton({
  initialLikes,
  projectId,
}: OptimisticLikeButtonProps) {
  // useTransition permite ejecutar tareas asíncronas pesadas en segundo plano
  // sin bloquear la interfaz de usuario de React.
  const [isPending, startTransition] = useTransition();

  // useOptimistic es el Hook oficial para la interfaz optimista.
  // Recibe: 1) El estado real (initialLikes), 2) Una función reductora de cómo sumar.
  const [optmisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state, incrementBy: number) => state + incrementBy,
  );

  function handleClick() {
    startTransition(async () => {
      // 1. Fase Optimista: Actualizamos la UI al instante, simulando que ya se guardó (+1)
      addOptimisticLike(1);

      try {
        // 2. Fase de Servidor: Hacemos la llamada real y potencialmente lenta al backend
        await incrementProjectLikesAction(projectId);
      } catch (error) {
        // 3. Fallo: Si el servidor falla (ej. sin internet), React revertirá automáticamente
        // el número de likes optimista (`optmisticLikes`) a su valor inicial (`initialLikes`) original.
        console.error("Error incrementando likes:", error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending} // Prevenimos spam de clicks mientras hay una petición en curso
      className="bg-red-500 font-bold text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-wait mt-4"
    >
      ❤️ Me gusta ({optmisticLikes})
    </button>
  );
}
