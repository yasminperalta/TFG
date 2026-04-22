import DVDCard from "./DVDCard";
import { useEffect, useState } from "react";
import { getPopularMovies } from "../services/tmdb";
import { addMovieToWishlist } from "../services/wishlistService";
import Scroll from "./Scroll";
import { addMovie } from "../services/movieService";
import { useAuth0 } from "@auth0/auth0-react";

function Famous() {
  const [movies, setMovies] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const [page, setPage] = useState(1);

  const handleAddToWishlist = async (movie) => {
    try {
      const token = await getAccessTokenSilently();

      await addMovieToWishlist(token, movie.imdb_id);

      setWishlist((prev) => [...prev, movie]);
    } catch (error) {
      console.error("Error añadiendo a wishlist:", error);
    }
  };

  useEffect(() => {

    // Cargar películas iniciales
    const loadMovies = async () => {
      try {
        const initialMovies = await getPopularMovies(1);
        const token = await getAccessTokenSilently();

        initialMovies.forEach((movie) => addMovie(token, movie));
        setMovies(initialMovies);
      } catch (error) {
        console.error("Error cargando películas:", error);
      }
    };
    loadMovies();
  }, []);

  const loadMoreMovies = async () => {
    try {
      const nextPage = page + 1;
      const newMovies = await getPopularMovies(nextPage);
      const token = await getAccessTokenSilently();

      await Promise.all(newMovies.map((movie) => addMovie(token, movie)));

      setMovies((prev) => [...prev, ...newMovies]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error cargando más películas:", error);
    }
  };

  return (
    <div className="m-0 font-sans bg-neutral-900 text-white min-h-screen">
      <section className="text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">Más buscados/populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 sm:px-8 justify-center">
          {movies.map((movie) => (
            <DVDCard
              key={movie.id}
              imdb_id={movie.id}
              title={movie.title}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              onAddToWishlist={handleAddToWishlist}
              shareLink={`https://www.themoviedb.org/movie/${movie.id}`}
            />
          ))}
        </div>
        {/* Botón Mostrar más */}
        <button
          onClick={loadMoreMovies}
          className="mt-8 px-6 py-3 bg-indigo-600 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Mostrar más
        </button>
      </section>

      {/* Botón Volver arriba */}
      <Scroll />
    </div>
  );
}

export default Famous;