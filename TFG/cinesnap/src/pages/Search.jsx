import { useEffect, useState } from "react";
import { useSearch } from "../context/search";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../services/tmdb";
import SearchView from "../components/Search/SearchView";

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

  return <SearchView urlQuery={urlQuery} movies={movies} loading={loading} />;
}

export default Search;
