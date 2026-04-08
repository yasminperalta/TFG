import { useCollections } from "../context/CollectionsProvider";
import CreateCollectionForm from "./CreateCollectionForm";
import { useState, useEffect } from "react";
import { FaGlobe, FaLock, FaShare } from "react-icons/fa";

function GlobalModal() {
  const { showModal, selectedMovie, closeSaveModal } = useCollections();
  const [collections, setCollections] = useState([
    { id: 1, name: "Favoritas", movies: [], isPublic: false },
    { id: 2, name: "Pendientes", movies: [], isPublic: false }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("collections");
    if (saved) {
      setCollections(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("collections", JSON.stringify(collections));
  }, [collections]);

  const addToCollection = (collectionId) => {
    if (!selectedMovie) return;
    
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, movies: [...col.movies, { ...selectedMovie, id: Date.now() }] }
          : col
      )
    );
    closeSaveModal();
  };

  const createCollection = (name, isPublic = false) => {
    const newCol = {
      id: Date.now(),
      name,
      movies: selectedMovie ? [{ ...selectedMovie, id: Date.now() }] : [],
      isPublic
    };
    setCollections((prev) => [...prev, newCol]);
    closeSaveModal();
  };

  const shareCollection = (col) => {
    const shareUrl = `${window.location.origin}/shared/${col.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Enlace copiado al portapapeles!");
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-80 space-y-4 shadow-2xl">
        <h3 className="text-xl font-bold text-white">Guardar en lista</h3>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => addToCollection(col.id)}
              className="w-full text-left p-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-between"
            >
              <span>{col.name}</span>
              <span className="text-gray-400 text-sm">
                {col.isPublic ? <FaGlobe /> : <FaLock />}
              </span>
            </button>
          ))}
        </div>

        <CreateCollectionForm onCreate={createCollection} />

        <button
          onClick={closeSaveModal}
          className="w-full text-sm text-gray-400 hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default GlobalModal;