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

  // Función para mover el carrusel izquierda/derecha
  const scroll = (direction) => {
    const maxScroll = Math.max(0, movies.length - maxVisible);

    if (direction === "left") {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else {
      setCurrentIndex((prev) => Math.min(maxScroll, prev + 1));
    }
  };

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
                        collections={[]}
                      />
                    </div>
                  )
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
        )}
      </div>
    </div>
  );
}

export default CollectionsCarousel;
