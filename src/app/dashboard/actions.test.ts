import { describe, it, expect, vi, beforeEach } from "vitest";
import { createProjectOptimisticAction } from "./actions";
import * as projectsLib from "@/lib/projects";
import * as nextCache from "next/cache";

// Creamos un Mock (simulación) completo para evitar escribir en la Base de Datos real durante los tests
vi.mock("@/lib/projects", () => ({
  createProject: vi.fn(),
}));

// Mockeamos funcionalidades exclusivas del framework Next.js
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Hito 5: Unit Testing - createProjectOptimisticAction", () => {
  // Estado falso previo simulando la firma de useActionState
  const mockPreviousState = { success: false, message: "", requestId: 0 };

  beforeEach(() => {
    vi.clearAllMocks(); // Limpia los contadores de llamadas entre cada test
  });

  it("Debería retornar un error de validación cuando el título está vacío (Zod Error)", async () => {
    // 1. Arrange: Preparamos los datos malos (simulando que el usuario envió un form vacío)
    const formData = new FormData();
    formData.append("title", "");
    formData.append("description", "Descripción opcional");

    // 2. Act: Ejecutamos la Server Action
    const result = await createProjectOptimisticAction(mockPreviousState, formData);

    // 3. Assert: Comprobamos el resultado estricto
    expect(result.success).toBe(false);
    expect(result.message).toContain("errores en el formulario");
    expect(result.errors).toBeDefined();
    expect(result.errors?.title).toBeDefined();

    // Verificamos matemáticamente que NUNCA se intentó guardar en BD si falló antes
    expect(projectsLib.createProject).not.toHaveBeenCalled();
    expect(nextCache.revalidatePath).not.toHaveBeenCalled();
  });

  it("Debería retornar éxito y llamar a Prisma si los datos son correctos", async () => {
    // 1. Arrange: Preparamos datos ideales
    const formData = new FormData();
    // NOTA: El título no puede pasar de 20 caracteres según el esquema Zod
    formData.append("title", "Proyecto brillante");
    formData.append("description", "Aprender testing en Node");

    // Simulamos que la función createProject real devuelve magia
    vi.mocked(projectsLib.createProject).mockResolvedValue({
      id: 1,
      title: "Proyecto brillante",
      description: "Aprender testing en Node",
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: ""
    });

    // 2. Act: Ejecutamos la Server Action
    const result = await createProjectOptimisticAction(mockPreviousState, formData);

    // 3. Assert: Comprobamos el resultado exitoso
    expect(result.success).toBe(true);
    expect(result.message).toBe("Proyecto creado exitosamente");

    // Verificamos que sí se mandó a crear en Base de Datos
    expect(projectsLib.createProject).toHaveBeenCalledTimes(1);
    expect(projectsLib.createProject).toHaveBeenCalledWith("Proyecto brillante", "Aprender testing en Node");

    // Y verificamos que Next.js purgaría el dashboard
    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/dashboard");
  });
});
