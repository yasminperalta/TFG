import { useCollections } from "../context/CollectionsProvider";
import CreateCollectionForm from "./Collection/CreateCollectionForm";
import { useState, useEffect } from "react";
import { FaGlobe, FaLock, FaShare } from "react-icons/fa";

function GlobalModal() {
  const { showModal, selectedMovie, closeSaveModal } = useCollections();
  const [collections, setCollections] = useState([
    { id: 1, name: "Mi colección", movies: [], isPublic: false },
    { id: 2, name: "Favoritas", movies: [], isPublic: false },
    { id: 3, name: "Pendientes", movies: [], isPublic: false }
  ]);

  // Cargar colecciones desde localStorage con migración
  const loadCollections = () => {
    const saved = localStorage.getItem("collections");
    if (saved) {
      let parsed = JSON.parse(saved);
      
      // Migración: asegurar IDs correctos según nombre (ignorando mayúsculas)
      const migrated = [];
      const processedNames = new Set();
      
      const normalize = (name) => name.toLowerCase().trim();
      
      const targetNames = [
        { id: 1, name: "Mi colección" },
        { id: 2, name: "Favoritas" },
        { id: 3, name: "Pendientes" }
      ];
      
      targetNames.forEach(target => {
        const found = parsed.find(col => normalize(col.name) === normalize(target.name));
        if (found) {
          migrated.push({ ...found, id: target.id });
          processedNames.add(found.name);
        }
      });
      
      // Añadir otras colecciones que no sean las 3 principales
      const others = parsed.filter(col => !targetNames.some(t => normalize(t.name) === normalize(col.name)));
      const final = [...migrated, ...others];
      
      // Ordenar por ID (Mi colección primero)
      final.sort((a, b) => a.id - b.id);
      
      setCollections(final);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

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
    // Escuchar cambios desde UploadImage (misma pestaña)
    const handleCollectionsChanged = () => loadCollections();
    window.addEventListener('collectionsChanged', handleCollectionsChanged);
    return () => window.removeEventListener('collectionsChanged', handleCollectionsChanged);
  }, []);

  useEffect(() => {
    // Escuchar cambios desde UploadImage (misma pestaña)
    const handleCollectionsChanged = () => loadCollections();
    window.addEventListener('collectionsChanged', handleCollectionsChanged);
    return () => window.removeEventListener('collectionsChanged', handleCollectionsChanged);
  }, []);

  useEffect(() => {
    localStorage.setItem("collections", JSON.stringify(collections));
  }, [collections]);

  const addToCollection = (collectionId) => {
  if (!selectedMovie || !selectedMovie.imdb_id) return;
  
  setCollections((prev) =>
    prev.map((col) =>
      col.id === collectionId
        ? {
            ...col,
            movies: col.movies.some(m => m.imdb_id === selectedMovie.imdb_id)
              ? col.movies
              : [...col.movies, { ...selectedMovie, id: Date.now() }]
          }
        : col
    )
  );

  const alreadyExists = collections.find(c => c.id === collectionId)?.movies
    .some(m => m.imdb_id === selectedMovie.imdb_id);

  if (!alreadyExists) {
    closeSaveModal();
  } else {
    alert("Esta película ya está en la lista");
  }
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