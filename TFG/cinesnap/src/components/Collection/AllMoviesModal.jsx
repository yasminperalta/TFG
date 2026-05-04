function AllMoviesModal({ collection, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-[90vw] max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
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

        {/* Grid de películas (mismo formato que Famous.jsx) */}
        {collection.movies.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No hay películas en esta lista.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {collection.movies.map((movie, index) => (
              <div key={movie.imdb_id || index} className="relative bg-neutral-800 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform">
                <img
                  src={movie.image || "https://via.placeholder.com/300x450"}
                  alt={movie.title}
                  className="w-full h-[270px] object-cover"
                />
                <div className="p-2 text-center">
                  <p className="text-sm font-semibold">{movie.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllMoviesModal;
