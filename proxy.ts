/**
 * MIDDLEWARE DE NEXT.JS
 * Este archivo (que idealmente debería llamarse middleware.ts) se ejecuta 
 * "En el borde" (Edge) ANTES de que cualquier petición llegue a tus rutas o páginas.
 * Es perfecto para seguridad, redirecciones, internacionalización y protección de rutas.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// La función principal exportada debe ser manejadora de middleware
export function proxy(request: NextRequest) {
  // Ojo: esto se ejecuta por cada petición entrante a las rutas matcheadas
  console.log("Proxy (Middleware) ejecutándose para:", request.url);

  // Leemos las cookies directamente de la cabecera HTTP de la petición entrante
  const token = request.cookies.get("token");

  // Lógica de Protección de Rutas:
  // Si NO hay token (usuario no logueado) Y quiere entrar a páginas de /dashboard...
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    // ...lo pateamos de vuelta al Login automáticamente.
    // NextResponse.redirect envía un código HTTP 307 temporal redirect al navegador.
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// El "config" limita dónde se dispara este Middleware.
// Evita gastar recursos ejecutándolo en imágenes, scripts o rutas públicas.
export const config = {
  // Solo se ejecutará para cualquier ruta que empiece por /dashboard
  matcher: ["/dashboard/:path*"],
};
