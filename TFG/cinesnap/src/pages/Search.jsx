import { useEffect, useState } from "react";
import { useSearch } from "../context/search";
import { useSearchParams } from "react-router-dom";
import { searchMoviesInDB } from "../services/tmdb";
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
    const fetchResults = async () => {
      if (!urlQuery) return;

      setLoading(true);
      try {
        // Llamada endpoint del backend
        const results = await searchMoviesInDB(urlQuery);
        setMovies(results || []);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [urlQuery]); // Se ejecuta cada vez que el usuario busca algo nuevo

  return <SearchView urlQuery={urlQuery} movies={movies} loading={loading} />;
}
export default Search;