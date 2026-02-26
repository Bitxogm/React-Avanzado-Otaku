import { helloAction } from "./actions";

export const dynamic = 'force-static';

/**
 * FormPage es un Server Component básico que renderiza un formulario de pruebas.
 * Demuestra "Progressive Enhancement": cómo Next.js maneja formularios nativos sin JavaScript de cliente
 * (aprovechando el atributo estándar `action`).
 */
export default function FormPage() {

  return (

    <div>
      <h1 className="text-2xl font-bold underline">Form Page</h1>
      <p>This is the form page.</p>

      {/* 
        En Next.js App Router, el atributo "action" del <form> puede recibir directamente una Server Action.
        Esto enviaría los datos al servidor para procesarlos ¡incluso si el usuario ha deshabilitado Javascript!
      */}
      <form className="space-y-6 p-6" action={helloAction}>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
        <input type="text" id="username" name="username" required className="px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" />

        {/* Este simple botón "submit" desatará todo el flujo de Next.js hacia la función 'helloAction' */}
        <button className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg transition-all cursor-pointer" type="submit">Submit</button>
      </form>
    </div>

  );

};