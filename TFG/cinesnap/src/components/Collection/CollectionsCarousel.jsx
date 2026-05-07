import { useState } from "react";
import DVDCard from "../DVDCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function CollectionsCarousel({
  movies,
  maxVisible = 5,
  showDelete,
  onDeleteMovie,
  wishlist
}) {
  // Índice del primer elemento visible en el carrusel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para mover el carrusel izquierda/derecha
  const scroll = (direction) => {
    const maxScroll = Math.max(0, movies.length - maxVisible);

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
    <div className="relative flex items-center justify-center w-full">
      {/* Botón izquierda */}
      <button
        onClick={() => scroll("left")}
        disabled={currentIndex === 0 || movies.length <= maxVisible}
        className="absolute left-0 z-10 bg-black/50 p-2 rounded-full hover:bg-[#ff6347] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Contenedor visible */}
      <div className="flex gap-6 overflow-visible px-4 sm:px-8">
        {movies
          .slice(currentIndex, currentIndex + maxVisible)
          .map((movie, idx) => {
            // Índice real en el array original
            const realIndex = currentIndex + idx;
            return (
              <div key={movie.id || idx} className="relative z-10 flex-1 min-w-0">
                <DVDCard
                  imdb_id={movie.id}
                  title={movie.title}
                  image={movie.image}
                  shareLink={`https://www.themoviedb.org/movie/${movie.id}`}
                  onDelete={showDelete ? () => onDeleteMovie(realIndex) : undefined}
                  wishlist={wishlist}
                />
              </div>
            );
          })}
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
