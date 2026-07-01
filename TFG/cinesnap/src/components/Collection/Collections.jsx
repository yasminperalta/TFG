import { useState, useEffect } from "react";
import DVDCard from "../DVDCard";
import { FaGlobe, FaLock, FaShare, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import CollectionsCarousel from "./CollectionsCarousel";
import EditCollectionModal from "./EditCollectionModal";
import CreateCollectionModal from "./CreateCollectionModal";
import AllMoviesModal from "./AllMoviesModal";
import { useAuth0 } from "@auth0/auth0-react";
import { createCollection, getYourCollections, removeCollection, updateCollection, deleteMovieFromCollection } from "../../services/collectionService";
import { useCollections } from "../../context/CollectionsProvider";
import { getWishlistMovies } from "../../services/wishlistService";
import { ThreeDot } from "react-loading-indicators";

// PÁGINA PRINCIPAL
function Collections() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { savedVersion } = useCollections();
  const [wishlist, setWishlist] = useState([]);
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingCollectionId, setViewingCollectionId] = useState(null);

  // Deriva siempre el objeto vivo desde collections para que el modal se actualice en tiempo real
  const viewingCollection = viewingCollectionId
    ? collections.find((c) => c.id === viewingCollectionId) ?? null
    : null;
  const [maxVisible, setMaxVisible] = useState(5);
  const [loading, setLoading] = useState(true);

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

  // featuredMovies se deriva automáticamente de "Mi colección" (nombre exacto)
  const myCollection = collections.find(col => col.name === "Mi colección");
  const featuredMovies = myCollection?.movies.map(m => {
    const movieData = m.movie_details || {};
    return {
      id: parseInt(movieData.imdb_id || m.imdb_id),
      title: movieData.title || m.title,
      image: movieData.poster_url || m.image || ''
    };
  }) || [];

  // CARGAR PELÍCULAS EN WISHLIST
  const loadWishlistMovies = async function () {
    const token = await getAccessTokenSilently();
    const dbmovies = await getWishlistMovies(token);

    setWishlist((prevWishlist) => {
      const allWishlistMovies = [...prevWishlist, ...dbmovies];
      // Filtramos para quedarnos solo con la primera aparición de cada ID,
      // esto porque React lanza useEffect DOS veces cuando inicias el script dev
      const uniqueWishlistMovies = allWishlistMovies.filter((movie, index, self) =>
        index === self.findIndex((m) => m.id === movie.id)
      );

      return uniqueWishlistMovies;
    });
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlistMovies();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  // CARGA DE COLECCIONES
  const loadCollections = async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getYourCollections(token);
      // Reemplazamos el estado directamente — no mezclamos con el anterior
      // para que las actualizaciones (nueva película en colección) sean visibles al instante
      setCollections(data);
      setLoading(false);
    } catch (error) {
      console.error("Error recuperando tus colecciones:", error);
    }
  };

  // Recarga cuando se monta la página y cada vez que se guarda una película desde GlobalModal
  useEffect(() => {
    loadCollections();
  }, [savedVersion]);

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

  // ELIMINAR PELÍCULA DE LISTA (por collection_movie_id para mayor seguridad)
  const handleRemoveMovie = async (colId, movieIdx) => {
    try {
      const token = await getAccessTokenSilently();
      const collection = collections.find(c => c.id === colId);
      if (!collection || !collection.movies[movieIdx]) return;

      const collectionMovieId = collection.movies[movieIdx].id;
      await deleteMovieFromCollection(token, collectionMovieId);

      // Actualizar estado localmente
      setCollections((prevCollections) =>
        prevCollections.map((col) =>
          col.id === colId
            ? {
              ...col,
              movies: col.movies.filter((_, idx) => idx !== movieIdx),
            }
            : col
        )
      );
    } catch (error) {
      console.error("Error borrando película de colección:", error);
    }
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">

        {/* SIDEBAR: Acciones y Listas (Ocupa 3 de 12 columnas) */}
        <aside className="md:col-span-3 space-y-6">
          <div className="sticky top-20 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl max-h-[calc(100vh-6rem)] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-1">Mi Biblioteca</h2>
            <p className="text-gray-400 text-sm mb-6">Gestiona tus colecciones</p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-900/20"
            >
              <FaPlus size={14} /> Nueva Lista
            </button>

            <nav className="mt-8 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tus Listas</p>
              {collections
                .filter(col => col.name !== "Mi colección")
                .map((col) => (
                  <div
                    key={col.id}
                    className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span
                      className="text-gray-300 group-hover:text-white truncate flex-1"
                      onClick={() => {
                        document.getElementById(`col-${col.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      {col.name}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingCollection(col)} className="text-gray-500 hover:text-white"><FaEdit size={12} /></button>
                    </div>
                  </div>
                ))}
            </nav>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL (Ocupa 9 de 12 columnas) */}
        <main className="md:col-span-9 space-y-12">

          {/* Sección: Mi Colección Principal */}
           <section>
             <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-4">
               <div>
                 <h2 className="text-3xl font-extrabold tracking-tight">Mi Colección</h2>
                 <p className="text-gray-400 text-sm">Películas de tu catálogo principal</p>
               </div>
             </div>

              {featuredMovies.length > 0 && (
                <CollectionsCarousel
                  movies={featuredMovies}
                  maxVisible={maxVisible}
                  showDelete={true}
                  onDeleteMovie={(idx) => handleRemoveMovie(myCollection?.id, idx)}
                  wishlist={wishlist}
                  col={myCollection}
                  onViewAll={(col) => setViewingCollectionId(col.id)}
                />
              )}
           </section>

           {/* Sección: Otras Listas */}
          <section className="space-y-10">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-8 h-[2px] bg-red-600"></span>
              Colecciones
            </h2>

            {loading ? (
              <div className="flex justify-center py-20">
                <ThreeDot color={["#dc2626"]} />
              </div>
            ) : (
              collections
                .filter(col => col.name !== "Mi colección")
                .map((col) => (
                   <div key={col.id} id={`col-${col.id}`}>
                   <CollectionsCarousel
                     wishlist={wishlist}
                     movies={col.movies.map(m => ({
                       id: parseInt(m.movie_details?.imdb_id || m.imdb_id),
                       title: m.movie_details?.title || m.title,
                       image: m.movie_details?.poster_url || m.image
                     }))}
                     maxVisible={maxVisible}
                     showDelete={true}
                     onDeleteMovie={(idx) => handleRemoveMovie(col.id, idx)}
                     col={col}
                     onViewAll={(col) => setViewingCollectionId(col.id)}
                   />
                   </div>
                ))
            )}
          </section>

          {/* modal edición */}
          {editingCollection && (
            <EditCollectionModal
              collection={editingCollection}
              onSave={saveCollection}
              onClose={() => setEditingCollection(null)}
              onDelete={deleteCollection}
              existingNames={collections.map(c => c.name)}
            />
          )}

            {showCreateModal && (
              <CreateCollectionModal
                onCreate={onCreateCollection}
                onClose={() => setShowCreateModal(false)}
                existingNames={collections.map(c => c.name)}
              />
            )}

            {viewingCollection && (
              <AllMoviesModal
                collection={viewingCollection}
                onClose={() => setViewingCollectionId(null)}
                onDeleteMovie={(idx) => handleRemoveMovie(viewingCollection?.id, idx)}
                wishlist={wishlist}
              />
            )}
          </main>
      </div>
    </div>
  );
}

export default Collections;