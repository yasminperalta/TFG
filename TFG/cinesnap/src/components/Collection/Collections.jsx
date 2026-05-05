import { useState, useEffect } from "react";
import DVDCard from "../DVDCard";
import Scroll from "../Scroll";
import { FaGlobe, FaLock, FaShare, FaEdit, FaTrash, FaPlus, FaList } from "react-icons/fa";
import CollectionsCarousel from "./CollectionsCarousel";
import EditCollectionModal from "./EditCollectionModal";
import CreateCollectionModal from "./CreateCollectionModal";
import AllMoviesModal from "./AllMoviesModal";
import { useAuth0 } from "@auth0/auth0-react";
import { createCollection, getYourCollections, removeCollection, updateCollection } from "../../services/collectionService";

// PÁGINA PRINCIPAL
function Collections() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingCollection, setViewingCollection] = useState(null);
  const [maxVisible, setMaxVisible] = useState(5);

  // Ajustar maxVisible según ancho de pantalla (igual que Famous grid)
  useEffect(() => {
    const updateMaxVisible = () => {
      const width = window.innerWidth;
      if (width >= 1280) setMaxVisible(6);      // xl
      else if (width >= 1024) setMaxVisible(5); // lg
      else if (width >= 768) setMaxVisible(4);  // md
      else if (width >= 640) setMaxVisible(3);  // sm
      else setMaxVisible(2);                    // mobile
    };
    updateMaxVisible();
    window.addEventListener('resize', updateMaxVisible);
    return () => window.removeEventListener('resize', updateMaxVisible);
  }, []);

  // featuredMovies se deriva automáticamente de "Mi colección" (id 1)
  const featuredMovies = collections.find(col => col.id === 1)?.movies.map(m => ({
    id: parseInt(m.imdb_id),
    title: m.title,
    image: m.image
  })) || [];

  useEffect(() => {
    console.log("El estado collections ha cambiado:", collections);
  }, [collections]);

  // CARGA DE COLECCIONES con migración de IDs
  const loadCollections = async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getYourCollections(token);

      setCollections((prevCollections) => {
        const allCollections = [...prevCollections, ...data];
        // Filtramos para quedarnos solo con la primera aparición de cada ID,
        // esto porque React lanza useEffect DOS veces cuando inicias el script dev
        const uniqueCollections = allCollections.filter((collection, index, self) =>
          index === self.findIndex((c) => c.id === collection.id)
        );

        return uniqueCollections;
      });

    } catch (error) {
      console.error("Error recuperando tus colecciones:", error);
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
  const saveCollection = async (updated) => {
    try {
      const token = await getAccessTokenSilently();
      const data = await updateCollection(token, updated);

      setCollections((prevCollections) => {
        prevCollections.map(col => {
          if (col.id === updated.id) {
            col.name = updated.name;
            col.is_public = updated.is_public;
          }
        });

        return [...prevCollections];
      });

    } catch (error) {
      console.error("Error recuperando tus colecciones:", error);
    }
  };

  // ELIMINAR COLECCIÓN
  const deleteCollection = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      const data = await removeCollection(token, id);

    } catch (error) {
      console.error("Error borrando colección:", error);
    }

    setCollections((prevCollections) => prevCollections.filter((col) => col.id !== id));
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

  // CREAR NUEVA COLECCIÓN
  const onCreateCollection = async (name, isPublic) => {
    try {
      const token = await getAccessTokenSilently();
      const data = await createCollection(token, { name: name, is_public: isPublic });

      setCollections((prevCollections) => [...prevCollections, data])
    } catch (error) {
      console.error("Error creando colección:", error);
    }

    setShowCreateModal(false);
  };

  return (
    <div className="relative min-h-screen m-0 font-sans text-white">
      {/* fondo */}
      <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
      <div className="absolute inset-0 bg-black opacity-85"></div>

      <section className="relative text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">Mi colección</h2>
        <p className="mb-5">Películas destacadas</p>
        {/* Botón ver todas */}
        {featuredMovies.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={() => {
                const myCollection = collections.find(col => col.id === 1);
                if (myCollection) setViewingCollection(myCollection);
              }}
              className="flex items-center gap-2 bg-[#E50914] text-white px-4 py-2 text-sm rounded hover:bg-red-700 transition"
              title="Ver todas"
            >
              <FaList size={14} /> Ver todas
            </button>
          </div>
        )}
        {/* Grid de películas */}
        <CollectionsCarousel
          movies={featuredMovies}
          maxVisible={maxVisible}
          showDelete={true}
          onDeleteMovie={(idx) => removeMovieFromCollection(1, idx)}
        />

        <h2 className="text-4xl mb-5 mt-16">Mis Listas</h2>
        <p>Aquí puedes ver tus listas.</p>
        {/* Botón para crear nueva lista */}
        <div className="mt-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#E50914] text-white px-5 py-2 cursor-pointer hover:bg-red-700 transition rounded"
          >
            <FaPlus /> Crear nueva lista
          </button>
        </div>
        {/* listado de colecciones */}
        <div className="mt-6 space-y-8 text-left">
          {collections
            .map((col) => (
              <div key={col.id}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl">{col.name}</h3>
                  {/* icono público/privado */}
                  <span
                    className="text-gray-400"
                    title={col.is_public ? "Pública" : "Privada"}
                  >
                    {col.is_public ? <FaGlobe /> : <FaLock />}
                  </span>
                  {/* ver todas las películas */}
                  {col.movies.length > 0 && (
                    <button
                      onClick={() => setViewingCollection(col)}
                      className="text-gray-400 hover:text-white ml-auto"
                      title="Ver todas"
                    >
                      <FaList />
                    </button>
                  )}
                  {/* editar colección */}
                  <button
                    onClick={() => setEditingCollection(col)}
                    className="text-gray-400 hover:text-white"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  {/* compartir solo si es pública */}
                  {col.is_public && (
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
                  maxVisible={maxVisible}
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
      {showCreateModal && (
        <CreateCollectionModal
          onCreate={onCreateCollection}
          onClose={() => setShowCreateModal(false)}
        />
      )}
      {viewingCollection && (
        <AllMoviesModal
          collection={viewingCollection}
          onClose={() => setViewingCollection(null)}
        />
      )}
      <Scroll />
    </div>
  );
}

export default Collections;