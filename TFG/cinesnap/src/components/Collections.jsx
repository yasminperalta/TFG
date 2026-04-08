import { useState, useEffect } from "react";
import DVDCard from "./DVDCard";
import Scroll from "./Scroll";
import { FaChevronLeft, FaChevronRight, FaGlobe, FaLock, FaShare, FaEdit, FaTrash } from "react-icons/fa";
import { getMovieDetails } from "../services/tmdb";

const exampleMovies = [
  { id: 27607, title: "Parents" },
  { id: 27205, title: "Origen" },
  { id: 438631, title: "Dune" }
];

function Carousel({ movies, maxVisible = 5, showDelete, onDeleteMovie }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction) => {
    const maxScroll = movies.length - maxVisible;
    if (direction === "left") {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(Math.min(maxScroll, currentIndex + 1));
    }
  };

  if (movies.length === 0) {
    return <p className="text-gray-400">No hay películas</p>;
  }

  return (
    <div className="relative flex items-center justify-center gap-4 max-w-5xl mx-auto">
      <button 
        onClick={() => scroll("left")}
        disabled={currentIndex === 0 || movies.length <= maxVisible}
        className="absolute left-0 z-10 bg-black/50 p-2 rounded-full hover:bg-[#ff6347] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaChevronLeft size={20} />
      </button>
      
      <div className="flex gap-4 overflow-hidden px-8">
        {movies.slice(currentIndex, currentIndex + maxVisible).map((movie, idx) => (
          <DVDCard
            key={movie.id || idx}
            title={movie.title}
            image={movie.image}
            onDelete={showDelete ? () => onDeleteMovie(idx) : undefined}
          />
        ))}
      </div>
      
      <button 
        onClick={() => scroll("right")}
        disabled={currentIndex >= movies.length - maxVisible || movies.length <= maxVisible}
        className="absolute right-0 z-10 bg-black/50 p-2 rounded-full hover:bg-[#ff6347] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
}

function EditCollectionModal({ collection, onSave, onClose, onDelete }) {
  const [name, setName] = useState(collection.name);
  const [isPublic, setIsPublic] = useState(collection.isPublic);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-80 space-y-4 shadow-2xl">
        <h3 className="text-xl font-bold text-white">Editar Lista</h3>
        
        <div>
          <label className="text-gray-400 text-sm">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 text-white border border-gray-600 focus:border-[#ff6347] focus:outline-none"
          />
        </div>

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

        <div className="flex gap-2">
          <button
            onClick={() => {
              onSave({ ...collection, name, isPublic });
              onClose();
            }}
            className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>

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
      </div>
    </div>
  );
}

function Collections() {
  const [collections, setCollections] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);

  const loadCollections = () => {
    const saved = localStorage.getItem("collections");
    if (saved) {
      setCollections(JSON.parse(saved));
    } else {
      setCollections([
        { id: 1, name: "Favoritas", movies: [], isPublic: false },
        { id: 2, name: "Pendientes", movies: [], isPublic: false }
      ]);
    }
  };

  useEffect(() => {
    loadCollections();
    
    const handleStorageChange = (e) => {
      if (e.key === "collections") {
        loadCollections();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    const interval = setInterval(loadCollections, 1000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const loadFeaturedMovies = async () => {
      const moviesWithImages = await Promise.all(
        exampleMovies.map(async (movie) => {
          try {
            const details = await getMovieDetails(movie.id);
            return {
              id: movie.id,
              title: details.title,
              image: details.image
            };
          } catch (error) {
            return { id: movie.id, title: movie.title, image: null };
          }
        })
      );
      setFeaturedMovies(moviesWithImages);
    };
    loadFeaturedMovies();
  }, []);

  const saveCollection = (updated) => {
    const saved = JSON.parse(localStorage.getItem("collections") || "[]");
    const updatedList = saved.map(col => col.id === updated.id ? updated : col);
    localStorage.setItem("collections", JSON.stringify(updatedList));
    setCollections(updatedList);
  };

  const deleteCollection = (id) => {
    const saved = JSON.parse(localStorage.getItem("collections") || "[]");
    const updatedList = saved.filter(col => col.id !== id);
    localStorage.setItem("collections", JSON.stringify(updatedList));
    setCollections(updatedList);
  };

  const removeMovieFromCollection = (colId, movieIdx) => {
    const saved = JSON.parse(localStorage.getItem("collections") || "[]");
    const updatedList = saved.map(col => {
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

  const shareCollection = (col) => {
    const shareUrl = `${window.location.origin}/shared/${col.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Enlace copiado al portapapeles!");
  };

  return (
    <div className="relative min-h-screen m-0 font-sans text-white">
      <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
      <div className="absolute inset-0 bg-black opacity-85"></div>

      <section className="relative text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">Mi colección</h2>
        <p className="mb-5">Películas destacadas</p>
        <Carousel movies={featuredMovies} maxVisible={5} />

        <h2 className="text-4xl mb-5 mt-16">Mis Listas</h2> 
        <p>Aquí puedes ver tus listas.</p>
        <div className="mt-6 space-y-8 text-left">
          {collections.map((col) => (
            <div key={col.id}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl">{col.name}</h3>
                <span className="text-gray-400" title={col.isPublic ? "Pública" : "Privada"}>
                  {col.isPublic ? <FaGlobe /> : <FaLock />}
                </span>
                <button
                  onClick={() => setEditingCollection(col)}
                  className="text-gray-400 hover:text-white"
                  title="Editar"
                >
                  <FaEdit />
                </button>
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
              <Carousel 
                movies={col.movies} 
                maxVisible={5} 
                showDelete={true}
                onDeleteMovie={(idx) => removeMovieFromCollection(col.id, idx)}
              />
            </div>
          ))}
        </div>
      </section>

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