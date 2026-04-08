import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DVDCard from "../components/DVDCard";
import Scroll from "../components/Scroll";
import { FaChevronLeft, FaChevronRight, FaGlobe, FaLock } from "react-icons/fa";

function Carousel({ movies, maxVisible = 5 }) {
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
        {movies.slice(currentIndex, currentIndex + maxVisible).map((movie) => (
          <DVDCard
            key={movie.id || movie.title}
            title={movie.title}
            image={movie.image}
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

function SharedCollection() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSharedCollection = () => {
      const saved = localStorage.getItem("collections");
      if (saved) {
        const collections = JSON.parse(saved);
        const found = collections.find(col => col.id === parseInt(id));
        if (found && found.isPublic) {
          setCollection(found);
        }
      }
      setLoading(false);
    };
    loadSharedCollection();
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-screen m-0 font-sans text-white">
        <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="relative text-center mt-12 p-10">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="relative min-h-screen m-0 font-sans text-white">
        <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
        <div className="absolute inset-0 bg-black opacity-85"></div>
        <div className="relative text-center mt-12 p-10">
          <h2 className="text-4xl mb-5">Lista no encontrada</h2>
          <p>La lista no existe o es privada.</p>
        </div>
        <Scroll />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen m-0 font-sans text-white">
      <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
      <div className="absolute inset-0 bg-black opacity-85"></div>

      <section className="relative text-center mt-12 p-10">
        <div className="flex items-center justify-center gap-3 mb-5">
          <h2 className="text-4xl">{collection.name}</h2>
          <span className="text-gray-400" title={collection.isPublic ? "Pública" : "Privada"}>
            {collection.isPublic ? <FaGlobe /> : <FaLock />}
          </span>
        </div>
        
        <p className="mb-8">{collection.movies.length} películas</p>
        
        {collection.movies.length > 0 ? (
          <Carousel movies={collection.movies} maxVisible={5} />
        ) : (
          <p className="text-gray-400">Esta lista está vacía.</p>
        )}
      </section>

      <Scroll />
    </div>
  );
}

export default SharedCollection;