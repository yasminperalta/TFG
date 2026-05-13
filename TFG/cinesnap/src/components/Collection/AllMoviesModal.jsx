import DVDCard from "../DVDCard";

function AllMoviesModal({ collection, onClose, onDeleteMovie, wishlist }) {
  if (!collection) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-xl p-6 w-[90vw] max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">{collection.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Grid de películas con scroll vertical */}
        {collection.movies.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No hay películas en esta lista.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {collection.movies.map((movie, idx) => {
              const movieData = movie.movie_details || {};
              const movieId = parseInt(movieData.imdb_id || movie.imdb_id);
              const movieTitle = movieData.title || movie.title;
              const movieImage = movieData.poster_url || movie.image || '';

              return (
                <div key={movie.imdb_id || idx} className="flex-1 min-w-0">
                  <DVDCard
                    imdb_id={movieId}
                    title={movieTitle}
                    image={movieImage}
                    shareLink={`https://www.themoviedb.org/movie/${movieId}`}
                    onDelete={onDeleteMovie ? () => onDeleteMovie(idx) : undefined}
                    wishlist={wishlist || []}
                    collections={[]}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllMoviesModal;