"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(`[dashboard/[id]/error]`, error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="space-y-6 max-w-lg">
        <h1 className="text-6xl font-extrabold text-red-600 dark:text-red-500 tracking-widest drop-shadow-sm">
          ERROR
        </h1>
        <div className="bg-red-600 px-2 text-sm rounded rotate-12 absolute p-1 text-white select-none">
          Detalles del proyecto no disponibles
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          ¡No pudimos cargar el proyecto!
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-400 wrap-break-word">
          {error.message}
        </p>

        {error.digest && (
          <p className="text-xs text-gray-400">
            Digest: {error.digest}
          </p>
        )}

        <div className="pt-6 flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-gray-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-all duration-200"
          >
            Volver a Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
