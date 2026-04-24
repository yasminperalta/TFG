import { useState, useEffect } from "react";
import DVDCard from "../DVDCard";
import Scroll from "../Scroll";
import { FaGlobe, FaLock, FaShare, FaEdit, FaTrash } from "react-icons/fa";
import CollectionsCarousel from "./CollectionsCarousel";
import EditCollectionModal from "./EditCollectionModal";

// PÁGINA PRINCIPAL
function Collections() {
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);

  // featuredMovies se deriva automáticamente de "Mi colección" (id 1)
  const featuredMovies = collections.find(col => col.id === 1)?.movies.map(m => ({
    id: parseInt(m.imdb_id),
    title: m.title,
    image: m.image
  })) || [];
  // CARGA DE COLECCIONES con migración de IDs
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
      
      // Guardar estructura migrada
      localStorage.setItem("collections", JSON.stringify(final));
      setCollections(final);
      // featuredMovies se calcula automáticamente
    } else {
      // Si no hay datos, crear por defecto
      const defaultCollections = [
        { id: 1, name: "Mi colección", movies: [], isPublic: false },
        { id: 2, name: "Favoritas", movies: [], isPublic: false },
        { id: 3, name: "Pendientes", movies: [], isPublic: false }
      ];
      setCollections(defaultCollections);
      // featuredMovies se calcula automáticamente
    }
  };

  // EFECTO: COLECCIONES + LISTENERS
  useEffect(() => {
    loadCollections();

    // Escuchar cambios en localStorage desde otra pestaña
    const handleStorageChange = (e) => {
      if (e.key === "collections") {
        loadCollections();
      }
    };

    // Escuchar cambios desde componentes en misma pestaña (UploadImage, GlobalModal, etc.)
    const handleCollectionsChanged = () => loadCollections();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener('collectionsChanged', handleCollectionsChanged);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener('collectionsChanged', handleCollectionsChanged);
    };
  }, []);
  // GUARDAR COLECCIÓN
  const saveCollection = (updated) => {
    const saved = JSON.parse(localStorage.getItem("collections") || "[]");
    const updatedList = saved.map((col) =>
      col.id === updated.id ? updated : col,
    );
    localStorage.setItem("collections", JSON.stringify(updatedList));
    setCollections(updatedList);
  };

  // ELIMINAR COLECCIÓN
  const deleteCollection = (id) => {
    const saved = JSON.parse(localStorage.getItem("collections") || "[]");
    const updatedList = saved.filter((col) => col.id !== id);
    localStorage.setItem("collections", JSON.stringify(updatedList));
    setCollections(updatedList);
  };

  // ELIMINAR PELÍCULA DE LISTA (por imdb_id para mayor seguridad)
  const removeMovieFromCollection = (colId, movieIdx) => {
    const saved = JSON.parse(localStorage.getItem("collections") || "[]");
    const updatedList = saved.map((col) => {
      if (col.id === colId) {
        // Eliminar por índice (movieIdx) en el array de la colección
        const newMovies = [...col.movies];
        newMovies.splice(movieIdx, 1);
        return { ...col, movies: newMovies };
      }
      return col;
    });
    localStorage.setItem("collections", JSON.stringify(updatedList));
    setCollections(updatedList);
  };
  // COMPARTIR COLECCIÓN
  const shareCollection = (col) => {
    const shareUrl = `${window.location.origin}/shared/${col.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Enlace copiado al portapapeles!");
  };

  return (
    <div className="relative min-h-screen m-0 font-sans text-white">
      {/* fondo */}
      <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
      <div className="absolute inset-0 bg-black opacity-85"></div>

       <section className="relative text-center mt-12 p-10">
         <h2 className="text-4xl mb-5">Mi colección</h2>
         <p className="mb-5">Películas destacadas</p>
          {/* carrusel destacado */}
          <CollectionsCarousel
            movies={featuredMovies}
            maxVisible={5}
            showDelete={true}
            onDeleteMovie={(idx) => removeMovieFromCollection(1, idx)}
          />

         <h2 className="text-4xl mb-5 mt-16">Mis Listas</h2>
        <p>Aquí puedes ver tus listas.</p>
        {/* listado de colecciones (excluye "Mi colección" - id 1) */}
        <div className="mt-6 space-y-8 text-left">
          {collections
            .filter(col => col.id !== 1)
            .map((col) => (
            <div key={col.id}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl">{col.name}</h3>
                {/* icono público/privado */}
                <span
                  className="text-gray-400"
                  title={col.isPublic ? "Pública" : "Privada"}
                >
                  {col.isPublic ? <FaGlobe /> : <FaLock />}
                </span>
                {/* editar colección */}
                <button
                  onClick={() => setEditingCollection(col)}
                  className="text-gray-400 hover:text-white"
                  title="Editar"
                >
                  <FaEdit />
                </button>
                {/* compartir solo si es pública */}
                {col.isPublic && (
                  <button
                    onClick={() => shareCollection(col)}
                    className="text-[#ff6347] hover:text-white ml-auto"
                    title="Compartir"
                  >
                    <FaShare />
                  </button>
                )}
              </div>
              {/* carrusel de cada colección */}
              <CollectionsCarousel
                movies={col.movies}
                maxVisible={5}
                showDelete={true}
                onDeleteMovie={(idx) => removeMovieFromCollection(col.id, idx)}
              />
            </div>
          ))}
        </div>
      </section>
      {/* modal edición */}
      {editingCollection && (
        <EditCollectionModal
          collection={editingCollection}
          onSave={saveCollection}
          onClose={() => setEditingCollection(null)}
          onDelete={deleteCollection}
        />
      )}
      <Scroll />
    </div>
  );
}

export default Collections;