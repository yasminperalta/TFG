import { useEffect, useState } from "react";
import { useSearch } from "../context/search";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../services/tmdb";
import DVDCard from "../components/DVDCard";

function Search() {
  // Contexto global de búsqueda
  // (para sincronizar input con URL)
  const { setQuery } = useSearch();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  // Leer query de la URL (?q=...)
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  // URL → estado global
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // búsqueda real en TMDB
  useEffect(() => {
    if (!urlQuery.trim()) return;

    const fetchMovies = async () => {
      try {
        setLoading(true); // activar spinner
        const results = await searchMovies(urlQuery);
        setMovies(results);
      } catch (error) {
        console.error("Error buscando:", error);
      } finally {
        setLoading(false); // desactivar spinner
      }
    };

    // debounce de 300ms para evitar requests constantes
    const delay = setTimeout(fetchMovies, 300);
    // cleanup si cambia la query antes del fetch
    return () => clearTimeout(delay);
  }, [urlQuery]);

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

export default Search;
