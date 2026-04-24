import { useState } from "react";
import DVDCard from "../DVDCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function CollectionsCarousel({
  movies,
  maxVisible = 5,
  showDelete,
  onDeleteMovie,
}) {
  // Índice del primer elemento visible en el carrusel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para mover el carrusel izquierda/derecha
  const scroll = (direction) => {
    const maxScroll = movies.length - maxVisible;

    if (direction === "left") {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else {
      setCurrentIndex((prev) => Math.min(maxScroll, prev + 1));
    }
  };

  // Si no hay películas, mensaje fallback
  if (!movies || movies.length === 0) {
    return <p className="text-gray-400">No hay películas</p>;
  }

  return (
    <div className="relative flex items-center justify-center gap-4 max-w-5xl mx-auto">
      {/* Botón izquierda */}
      <button
        onClick={() => scroll("left")}
        disabled={currentIndex === 0 || movies.length <= maxVisible}
        className="absolute left-0 z-10 bg-black/50 p-2 rounded-full hover:bg-[#ff6347] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Contenedor visible */}
      <div className="flex gap-4 overflow-hidden px-8">
         {movies
           .slice(currentIndex, currentIndex + maxVisible)
           .map((movie, idx) => (
             <DVDCard
               key={movie.id || idx}
               imdb_id={movie.id}
               title={movie.title}
               image={movie.image}
               shareLink={`https://www.themoviedb.org/movie/${movie.id}`}
               onDelete={showDelete ? () => onDeleteMovie(currentIndex + idx) : undefined}
             />
           ))}
      </div>

      {/* Botón derecha */}
      <button
        onClick={() => scroll("right")}
        disabled={
          currentIndex >= movies.length - maxVisible ||
          movies.length <= maxVisible
        }
        className="absolute right-0 z-10 bg-black/50 p-2 rounded-full hover:bg-[#ff6347] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
}

export default CollectionsCarousel;
