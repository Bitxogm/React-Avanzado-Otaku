import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const AUTH_COOKIE_NAME = "session-token";
const COOKIE_EXPIRE_SECONDS = 60 * 60 * 24;

export async function createSession(userId: string) {
  try {
    console.log("[createSession] INICIANDO - userId:", userId);

    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${COOKIE_EXPIRE_SECONDS}s`)
      .sign(secret);

    console.log(
      "[createSession] Token creado:",
      token.substring(0, 50) + "...",
    );

    const cookieStore = await cookies();
    console.log("[createSession] Cookie store obtenido");

    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_EXPIRE_SECONDS,
    });

    console.log(
      "[createSession] ÉXITO - Cookie guardada:",
      AUTH_COOKIE_NAME,
      "MaxAge:",
      COOKIE_EXPIRE_SECONDS,
    );
  } catch (error) {
    console.error("[createSession] ERROR:", error);
    throw error;
  }
}

type SessionUser = {
  userId: string;
};

export async function getSession(): Promise<SessionUser | null> {
  try {
    console.log("[getSession] ===== LEYENDO SESIÓN =====");

    const cookieStore = await cookies();
    console.log("[getSession] Cookie store obtenido");

    const token = cookieStore.get(AUTH_COOKIE_NAME);
    console.log("[getSession] Buscando cookie:", AUTH_COOKIE_NAME);
    console.log("[getSession] Token encontrado?", !!token);

    if (!token) {
      console.log("[getSession] ❌ NO HAY COOKIE");
      // Log todas las cookies disponibles para debug
      const allCookies = cookieStore.getAll();
      console.log(
        "[getSession] Cookies disponibles:",
        allCookies.map((c) => c.name),
      );
      return null;
    }

    console.log("[getSession] Token encontrado, verificando...");
    console.log(
      "[getSession] Token value:",
      token.value.substring(0, 50) + "...",
    );

    const { payload } = await jwtVerify(token.value, secret);
    console.log("[getSession] ✅ Token válido, userId:", payload.userId);

    return {
      userId: payload.userId as string,
    };
  } catch (error) {
    console.error(
      "[getSession] ❌ ERROR:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
