import DVDCard from "./DVDCard";
import { useEffect, useState } from "react";
import { getPopularMovies } from "../services/tmdb";
import { getWishlistMovies } from "../services/wishlistService";
import Scroll from "./Scroll";
import { addMovie } from "../services/movieService";
import { useAuth0 } from "@auth0/auth0-react";
import { ThreeDot } from "react-loading-indicators";

function Famous() {
  const [movies, setMovies] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // CARGAR PELÍCULAS EN WISHLIST
  const loadWishlistMovies = async function () {
    const token = await getAccessTokenSilently();
    const dbmovies = await getWishlistMovies(token);

    setWishlist((prevWishlist) => {
      const allWishlistMovies = [...prevWishlist, ...dbmovies];
      // Filtramos para quedarnos solo con la primera aparición de cada ID,
      // esto porque React lanza useEffect DOS veces cuando inicias el script dev
      const uniqueWishlistMovies = allWishlistMovies.filter((movie, index, self) =>
        index === self.findIndex((m) => m.id === movie.id)
      );
      console.log(dbmovies);
      return uniqueWishlistMovies;
    });
  }

  // CARGAR PELÍCULAS INICIALES
  const loadMovies = async () => {
    try {
      const initialMovies = await getPopularMovies(1);

      // SOLO si el usuario está autenticado intentamos guardar en backend
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();

        initialMovies.forEach((movie) => addMovie(token, movie));
      }
      setMovies(initialMovies);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando películas:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated && wishlist.length == 0) {
      loadWishlistMovies();
    }

    loadMovies();
  }, [isAuthenticated, wishlist]);

  const loadMoreMovies = async () => {
    try {
      const nextPage = page + 1;
      const newMovies = await getPopularMovies(nextPage);

      // SOLO si está autenticado guardamos en backend
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();

        await Promise.all(newMovies.map((movie) => addMovie(token, movie)));
      }

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
          {/* Spinner */
            loading ? (
              <div className="flex justify-center">
                <ThreeDot color={["#dc2626"]} className="text-center" />
              </div>
            ) : (
              movies.map((movie) => (
                <DVDCard
                  key={movie.id}
                  imdb_id={movie.id}
                  title={movie.title}
                  saved={wishlist.some(wishlistmovie => parseInt(wishlistmovie.movie_details.imdb_id) === parseInt(movie.id))}
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  shareLink={`https://www.themoviedb.org/movie/${movie.id}`}
                  wishlist_movie_id={wishlist.find((wishlistmovie) => parseInt(wishlistmovie.movie_details.imdb_id) === parseInt(movie.id))?.id || -1}
                />
              ))
            )}
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
