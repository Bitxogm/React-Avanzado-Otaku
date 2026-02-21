"use server";

export async function helloAction(formData: FormData) {
  const username = formData.get("username");

  console.log("Username:", username);

  // TODO: Aquí iría la lógica para guardar en la BD
}
