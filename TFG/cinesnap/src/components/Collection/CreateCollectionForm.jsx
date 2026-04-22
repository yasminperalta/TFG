import { useState } from "react";

function CreateCollectionForm({ onCreate }) {
  // Estado para el nombre de la nueva colección
  const [name, setName] = useState("");
  // Estado para definir si la colección será pública o privada
  const [isPublic, setIsPublic] = useState(false);

  return (
    <div className="border-t border-gray-700 pt-3 space-y-2">
      {/* Input para escribir el nombre de la lista */}
      <input
        type="text"
        placeholder="Nueva lista..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 rounded bg-neutral-800 text-white placeholder-gray-400 border border-gray-600 focus:border-[#ff6347] focus:outline-none"
      />
      {/* Switch para hacer la lista pública o privada */}
      <div className="flex items-center justify-between">
        <span className="text-white text-sm">Hacer pública</span>
        <button
          type="button"
          onClick={() => setIsPublic(!isPublic)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? "bg-green-500" : "bg-gray-600"}`}
        >
          {/* Círculo del switch que se mueve según el estado */}
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      {/* Botón para crear la colección */}
      <button
        onClick={() => {
          if (!name.trim()) return; // Evita crear listas vacías
          onCreate(name, isPublic); // Llama a la función del componente padre
          // Limpia el formulario después de crear
          setName("");
          setIsPublic(false);
        }}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
      >
        Crear lista
      </button>
    </div>
  );
}

export default CreateCollectionForm;