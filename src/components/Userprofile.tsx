interface UserData {
  name: string;
  email: string;
}

// Simulamos una llamada asíncrona a un backend, base de datos o API.
const getUserData = async (): Promise<UserData> => {
  return {
    name: "Alex",
    email: "alex@example.com",
  };
};

/**
 * UserProfile NO tiene "use client", por lo tanto es un Server Component.
 * Además, nota que la función es 'async'. Los Server Components pueden usar async/await
 * para obtener datos (fetch, prisma, etc) directamente antes de renderizarse.
 * ¡Los Client Components NO pueden ser async de esta manera!
 */
export default async function UserProfile() {
  // Esperamos los datos en el servidor ANTES de enviar siquiera un byte de HTML al usuario
  const userData = await getUserData();

  return (
    <div className="bg-gray-800 border border-gray-600 p-4 rounded mt-2">
      {/* SSR = Server Side Rendered */}
      <h4 className="font-bold mb-2 text-blue-400">User Profile (SSR)</h4>
      <p className="text-sm">
        <strong className="text-gray-400">Name:</strong> {userData.name}
      </p>
      <p className="text-sm mt-1">
        <strong className="text-gray-400">Email:</strong> {userData.email}
      </p>
    </div>
  );
}
