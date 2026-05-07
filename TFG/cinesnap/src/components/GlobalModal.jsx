import { useCollections } from "../context/CollectionsProvider";
import CreateCollectionForm from "./Collection/CreateCollectionForm";
import { useState, useEffect } from "react";
import { FaGlobe, FaLock } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { getYourCollections, addMovieToCollection, createCollection as createCollectionService } from "../services/collectionService";

function GlobalModal() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { showModal, selectedMovie, closeSaveModal } = useCollections();
  const [collections, setCollections] = useState([]);

  // Cargar colecciones desde backend
  const loadCollections = async () => {
    if (!isAuthenticated) {
      setCollections([]);
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      const data = await getYourCollections(token);
      
      // Asegurar que existe "Mi colección"
      const miColeccion = data.find(col => col.name === 'Mi colección');
      if (!miColeccion) {
        // Crearla automáticamente
        const nuevaColeccion = await createCollectionService(token, { 
          name: 'Mi colección', 
          is_public: false 
        });
        data.push(nuevaColeccion);
      }
      
      setCollections(data);
    } catch (error) {
      console.error("Error cargando colecciones:", error);
      setCollections([]);
    }
  };

  useEffect(() => {
    if (showModal) {
      loadCollections();
    }
  }, [showModal, isAuthenticated]);

  const addToCollection = async (collectionId) => {
    if (!selectedMovie || !selectedMovie.imdb_id || !isAuthenticated) return;
    
    try {
      const token = await getAccessTokenSilently();
      await addMovieToCollection(token, collectionId, selectedMovie.imdb_id, {
        title: selectedMovie.title,
        image: selectedMovie.image
      });
      closeSaveModal();
      // Recargar colecciones
      loadCollections();
    } catch (error) {
      if (error.message.includes("already exists")) {
        alert("Esta película ya está en la lista");
      } else {
        console.error("Error añadiendo a colección:", error);
      }
    }
  };

  const createCollection = async (name, isPublic = false) => {
    if (!isAuthenticated || !selectedMovie) return;
    
    try {
      const token = await getAccessTokenSilently();
      const data = await createCollectionService(token, { name, is_public: isPublic });
      
      // Añadir película a la nueva colección
      await addMovieToCollection(token, data.id, selectedMovie.imdb_id, {
        title: selectedMovie.title,
        image: selectedMovie.image
      });
      
      closeSaveModal();
      loadCollections();
    } catch (error) {
      console.error("Error creando colección:", error);
    }
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
