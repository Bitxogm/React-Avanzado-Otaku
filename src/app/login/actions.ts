"use server";

import z from "zod";
import { LoginState } from "./types";
import { createSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/users";

const loginSchema = z.object({
  email: z.email("Email no es válido"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

function getFieldErrorsFromTree(
  error: z.ZodError<z.infer<typeof loginSchema>>,
): Record<string, string[]> {
  const tree = z.treeifyError(error);
  const fieldErrors: Record<string, string[]> = {};

  for (const [fieldName, node] of Object.entries(tree.properties ?? {})) {
    if (node?.errors.length) {
      fieldErrors[fieldName] = node.errors;
    }
  }

  return fieldErrors;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  console.log("\\n[loginAction] ===== INICIANDO LOGIN =====");

  const emailInput = String(formData.get("email"));
  const passwordInput = String(formData.get("password"));

  console.log("[loginAction] Email:", emailInput);

  const parsed = loginSchema.safeParse({
    email: emailInput,
    password: passwordInput,
  });

  if (!parsed.success) {
    console.log("[loginAction] ❌ Validación fallida");
    return {
      success: false,
      message: "Revisa los campos marcados",
      errors: getFieldErrorsFromTree(parsed.error),
      values: { email: emailInput },
    };
  }

  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password;

  console.log("[loginAction] Validación OK, buscando usuario...");

  const user = await verifyPassword(email, password);

  if (!user) {
    console.log(
      "[loginAction] ❌ Usuario no encontrado o contraseña incorrecta",
    );
    return {
      success: false,
      message: "Credenciales incorrectas",
      errors: {},
      values: { email: emailInput },
    };
  }

  console.log("[loginAction] ✅ Usuario encontrado:", user.id);
  console.log("[loginAction] Creando sesión...");

  await createSession(user.id);

  console.log("[loginAction] ✅ SESIÓN CREADA, retornando success");

  return {
    success: true,
    message: "Login exitoso. Redirigiendo...",
    errors: {},
    values: { email: emailInput },
  };
}
