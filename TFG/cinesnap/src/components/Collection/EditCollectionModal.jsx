import { useState } from "react";
import { FaGlobe, FaLock } from "react-icons/fa";

function EditCollectionModal({ collection, onSave, onClose, onDelete }) {
  const collection_id = collection.id
  // Estado local del nombre de la colección
  const [name, setName] = useState(collection.name);

  // Estado local de visibilidad (pública / privada)
  const [isPublic, setIsPublic] = useState(collection.is_public);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      {/* Modal */}
      <div className="bg-neutral-900 rounded-xl p-6 w-80 space-y-4 shadow-2xl">
        {/* Título */}
        <h3 className="text-xl font-bold text-white">Editar Lista</h3>

        {/* Nombre */}
        <div>
          <label className="text-gray-400 text-sm">Nombre</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={collection_id === 1}
            className="w-full p-2 rounded bg-neutral-800 text-white border border-gray-600 focus:border-[#ff6347] focus:outline-none"
            title={collection_id === 1 ? "No se puede editar el nombre de Mi colección" : ""}
          />
        </div>

        {/* Público / Privado */}
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Hacer pública</span>

          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            disabled={collection_id === 1}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPublic ? "bg-green-500" : "bg-gray-600"
            } ${collection_id === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            title={collection_id === 1 ? "Mi colección siempre es privada" : ""}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPublic ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          {/* Guardar */}
          <button
            onClick={() => {
              onSave({ id: collection_id, name: name, is_public: isPublic });
              onClose();
            }}
            className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>

          {/* Cancelar */}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>

        {/* Eliminar - solo si la colección no es "Mi colección" (id 1) */}
        {collection.id !== 1 && (
          <button
            onClick={() => {
              if (confirm("¿Eliminar esta lista?")) {
                onDelete(collection.id);
                onClose();
              }
            }}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Eliminar lista
          </button>
        )}
      </div>
    </div>
  );
}

export default EditCollectionModal;
