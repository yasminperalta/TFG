import DVDCard from "../DVDCard";

function AllMoviesModal({ collection, onClose, onDeleteMovie, wishlist }) {
  if (!collection) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      {/*
        overflow-hidden sin padding: el clip ocurre justo en el borde visual del modal.
        Así hover:scale-105 queda recortado en el borde, en vez de colarse por el padding.
      */}
      <div className="bg-neutral-900 rounded-xl w-[90vw] max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Header con su propio padding */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold text-white">{collection.name}</h3>
            <p className="text-gray-400 text-sm">{collection.movies.length} películas</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none ml-4"
          >
            ×
          </button>
        </div>

        {/* Grid scrollable con su propio padding */}
        {collection.movies.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 p-6">
            <p>No hay películas en esta lista.</p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div
              className="grid gap-4 p-6"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
            >
              {collection.movies.map((movie, idx) => {
                const movieData = movie.movie_details || {};
                const movieId = parseInt(movieData.imdb_id || movie.imdb_id);
                const movieTitle = movieData.title || movie.title;
                const movieImage = movieData.poster_url || movie.image || "";

                return (
                  <DVDCard
                    key={movie.id ?? idx}
                    imdb_id={movieId}
                    title={movieTitle}
                    image={movieImage}
                    shareLink={`https://www.themoviedb.org/movie/${movieId}`}
                    onDelete={onDeleteMovie ? () => onDeleteMovie(idx) : undefined}
                    wishlist={wishlist ?? []}
                    collections={[]}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllMoviesModal;
