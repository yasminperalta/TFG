import { useState, useEffect } from "react";
import DVDCard from "../DVDCard";
import Scroll from "../Scroll";
import { FaGlobe, FaLock, FaShare, FaEdit, FaTrash } from "react-icons/fa";
import CollectionsCarousel from "./CollectionsCarousel";
import EditCollectionModal from "./EditCollectionModal";

// PÁGINA PRINCIPAL
function Collections() {
  const [collections, setCollections] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);
  // CARGA DE COLECCIONES
  const loadCollections = () => {
    const saved = localStorage.getItem("collections");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCollections(parsed);
      
      // Extraer películas de la colección "Escaneadas" (id 999)
      const scanned = parsed.find(col => col.id === 999);
      if (scanned) {
        setFeaturedMovies(scanned.movies.map(m => ({
          id: parseInt(m.imdb_id),
          title: m.title,
          image: m.image
        })));
      } else {
        setFeaturedMovies([]);
      }
    } else {
      // Si no hay, crea datos por defecto
      const defaultCollections = [
        { id: 1, name: "Favoritas", movies: [], isPublic: false },
        { id: 2, name: "Pendientes", movies: [], isPublic: false },
        { id: 999, name: "Escaneadas", movies: [], isPublic: false }
      ];
      setCollections(defaultCollections);
      setFeaturedMovies([]);
    }
  };

  // EFECTO: COLECCIONES + LISTENER DE STORAGE
  useEffect(() => {
    loadCollections();

    // Detecta cambios en localStorage desde otra pestaña
    const handleStorageChange = (e) => {
      if (e.key === "collections") {
        loadCollections();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
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

  // ELIMINAR PELÍCULA DE LISTA
  const removeMovieFromCollection = (colId, movieIdx) => {
    const saved = JSON.parse(localStorage.getItem("collections") || "[]");
    const updatedList = saved.map((col) => {
      if (col.id === colId) {
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
         <CollectionsCarousel movies={featuredMovies} maxVisible={5} />

         <h2 className="text-4xl mb-5 mt-16">Mis Listas</h2>
        <p>Aquí puedes ver tus listas.</p>
        {/* listado de colecciones (excluye "Escaneadas" - id 999) */}
        <div className="mt-6 space-y-8 text-left">
          {collections
            .filter(col => col.id !== 999)
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