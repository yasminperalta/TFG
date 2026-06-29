import { useState } from "react";
import DVDCard from "../DVDCard";
import { FaChevronLeft, FaChevronRight, FaLock, FaGlobe, FaList } from "react-icons/fa";

function CollectionsCarousel({
  col,
  movies,
  maxVisible = 5,
  showDelete,
  onDeleteMovie,
  wishlist,
  onViewAll,
}) {
  // Índice del primer elemento visible en el carrusel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navegación circular: al llegar al final vuelve al principio y viceversa
  const scroll = (direction) => {
    if (movies.length <= maxVisible) return;
    if (direction === "left") {
      setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }
  };

  // Películas visibles con wrap circular (puede mezclar final + principio del array)
  const visibleMovies = Array.from({ length: Math.min(maxVisible, movies.length) }, (_, i) => {
    const realIndex = (currentIndex + i) % movies.length;
    return { ...movies[realIndex], _realIndex: realIndex };
  });

  return (
    <div key={col.id} className="bg-white/5 backdrop-blur-xl hover:bg-white/2 p-6 rounded-3xl transition-all border border-white/5">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold">{col.name}</h3>
        <span className="text-gray-600">|</span>
        <span className="text-xs bg-white/10 px-2 py-1 rounded uppercase tracking-widest text-gray-400">
          {col.movies.length} títulos
        </span>

        <div className="ml-auto flex items-center gap-4">
          {col.is_public ? <FaGlobe className="text-blue-400" title="Pública" /> : <FaLock className="text-gray-500" title="Privada" />}
          {movies && movies.length > maxVisible && onViewAll && (
            <button
              onClick={() => onViewAll(col)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors bg-white/5 px-3 py-1 rounded-full border border-white/10"
            >
              <FaList size={10} /> Ver todas
            </button>
          )}
        </div>
      </div>

      <div className="bg-black/20 rounded-2xl p-4">
        {!movies || movies.length === 0 ? (
          <p className="text-gray-400 italic text-center">No hay películas en esta colección</p>
        ) : (
          <div className="relative flex items-center justify-center w-full">
            {/* Botón izquierda */}
            <button
              onClick={() => scroll("left")}
              disabled={movies.length <= maxVisible}
              className="absolute left-0 z-10 bg-black/50 p-2 rounded-full hover:bg-[#ff6347] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={20} />
            </button>

            {/* Contenedor visible */}
            <div className="flex gap-2 sm:gap-4 overflow-visible px-6 sm:px-10">
              {visibleMovies.map((movie, idx) => (
                <div key={`${movie._realIndex}-${idx}`} className="relative z-10 flex-1 min-w-0">
                  <DVDCard
                    imdb_id={movie.id}
                    title={movie.title}
                    image={movie.image}
                    shareLink={`https://www.themoviedb.org/movie/${movie.id}`}
                    onDelete={showDelete ? () => onDeleteMovie(movie._realIndex) : undefined}
                    wishlist={wishlist}
                    collections={[]}
                  />
                </div>
              ))}
            </div>

            {/* Botón derecha */}
            <button
              onClick={() => scroll("right")}
              disabled={movies.length <= maxVisible}
              className="absolute right-0 z-10 bg-black/50 p-2 rounded-full hover:bg-[#ff6347] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionsCarousel;
