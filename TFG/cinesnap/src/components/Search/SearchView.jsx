import DVDCard from "../DVDCard";

function SearchView({ urlQuery, movies, loading }) {
  return (
    <div className="bg-neutral-900 text-white min-h-screen p-6 pt-24">
      <h2 className="text-3xl mb-6">
        Resultados para: <span className="text-[#ff6347]">{urlQuery}</span>
      </h2>

      {/* Estado: loading */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : movies.length === 0 ? (
        /* Estado: sin resultados */
        <p>No se encontraron resultados</p>
      ) : (
        /* Grid de peliculas */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <DVDCard
              key={movie.id}
              imdb_id={movie.id}
              title={movie.title}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              shareLink={`https://www.themoviedb.org/movie/${movie.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchView;
