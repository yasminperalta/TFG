import { useCollections } from "../context/CollectionsProvider";
import CreateCollectionForm from "./Collection/CreateCollectionForm";
import { useState, useEffect } from "react";
import { FaGlobe, FaLock } from "react-icons/fa";

function GlobalModal() {
  const { showModal, selectedMovie, closeSaveModal } = useCollections();
  const [collections, setCollections] = useState([]);

  // Cargar colecciones desde localStorage
  const loadCollections = () => {
    const saved = localStorage.getItem("collections");
    if (saved) {
      let parsed = JSON.parse(saved);
      
      // Migración: asegurar ID correcto para "Mi colección" y eliminar "Favoritas"/"Pendientes"
      const normalize = (name) => name.toLowerCase().trim();
      
      const miColeccion = parsed.find(col => normalize(col.name) === normalize("Mi colección"));
      const migrated = miColeccion ? [{ ...miColeccion, id: 1 }] : [];
      
      // Filtrar: excluir "Mi colección", "Favoritas" y "Pendientes"
      const others = parsed.filter(col => 
        !["mi colección", "favoritas", "pendientes"].includes(normalize(col.name))
      );
      
      const final = [...migrated, ...others];
      final.sort((a, b) => a.id - b.id);
      
      setCollections(final);
    }
  };

  useEffect(() => {
    if (showModal) {
      loadCollections();
    }
  }, [showModal]);

  useEffect(() => {
    // Escuchar cambios en localStorage desde otras pestañas/components
    const handleStorageChange = (e) => {
      if (e.key === "collections") {
        loadCollections();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    // Escuchar cambios desde otros componentes (UploadImage, Collections, etc.)
    const handleCollectionsChanged = () => loadCollections();
    window.addEventListener('collectionsChanged', handleCollectionsChanged);
    return () => window.removeEventListener('collectionsChanged', handleCollectionsChanged);
  }, []);

  const addToCollection = (collectionId) => {
    if (!selectedMovie || !selectedMovie.imdb_id) return;
    
    const saved = localStorage.getItem("collections") || "[]";
    const parsed = JSON.parse(saved);
    
    const updated = parsed.map((col) =>
      col.id === collectionId
        ? {
            ...col,
            movies: col.movies.some(m => m.imdb_id === selectedMovie.imdb_id)
              ? col.movies
              : [...col.movies, { ...selectedMovie, id: Date.now() }]
          }
        : col
    );
    
    localStorage.setItem("collections", JSON.stringify(updated));
    window.dispatchEvent(new Event('collectionsChanged'));
    setCollections(updated);
    
    const alreadyExists = parsed.find(c => c.id === collectionId)?.movies
      .some(m => m.imdb_id === selectedMovie.imdb_id);

    if (!alreadyExists) {
      closeSaveModal();
    } else {
      alert("Esta película ya está en la lista");
    }
  };

  const createCollection = (name, isPublic = false) => {
    const saved = localStorage.getItem("collections") || "[]";
    const parsed = JSON.parse(saved);
    
    const newCol = {
      id: Date.now(),
      name,
      movies: selectedMovie ? [{ ...selectedMovie, id: Date.now() }] : [],
      isPublic
    };
    
    const updated = [...parsed, newCol];
    localStorage.setItem("collections", JSON.stringify(updated));
    window.dispatchEvent(new Event('collectionsChanged'));
    setCollections(updated);
    closeSaveModal();
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
