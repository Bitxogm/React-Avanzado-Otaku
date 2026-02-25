"use server"; // Obligatorio para definir que estas funciones son exclusivas del servidor

// FormData es la API nativa del navegador para capturar datos de formularios
export async function helloAction(formData: FormData) {
  // Extraemos el valor del input buscando por su atributo 'name' ("username")
  const username = formData.get("username");

  // Este log se imprime en tu terminal (backend), nunca en el navegador del usuario
  console.log("Username recibido en el servidor:", username);

  // TODO: Aquí iría la lógica pesada: guardar en DB, enviar emails, consultar APIs externas, etc.
}
