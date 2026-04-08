import { useState } from "react";

function CreateCollectionForm({ onCreate }) {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  return (
    <div className="border-t border-gray-700 pt-3 space-y-2">
      <input
        type="text"
        placeholder="Nueva lista..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 rounded bg-neutral-800 text-white placeholder-gray-400 border border-gray-600 focus:border-[#ff6347] focus:outline-none"
      />

      <div className="flex items-center justify-between">
        <span className="text-white text-sm">Hacer pública</span>
        <button
          type="button"
          onClick={() => setIsPublic(!isPublic)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? 'bg-green-500' : 'bg-gray-600'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <button
        onClick={() => {
          if (!name.trim()) return;
          onCreate(name, isPublic);
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