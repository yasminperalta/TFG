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

      return uniqueWishlistMovies;
    });
  }

  // CARGAR PELÍCULAS INICIALES
  const loadMovies = async () => {
    try {
      const popularMovies = await getPopularMovies(1);
      setMovies(popularMovies ?? []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlistMovies();
    }
  }, [isAuthenticated, getAccessTokenSilently]); // Wishlist eliminada de aquí

  useEffect(() => {
    loadMovies();
  }, [isAuthenticated]); // Se ejecuta al cargar o si el login cambia

  const loadMoreMovies = async () => {
    try {
      const nextPage = page + 1;
      const newMovies = await getPopularMovies(nextPage);

      setMovies((prev) => [...prev, ...(newMovies ?? [])]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error cargando más películas:", error);
    }
  };

  return (
    <div className="m-0 font-sans bg-white/5 backdrop-blur-xl hover:bg-white/2 p-3 sm:p-6 rounded-3xl transition-all border border-white/5 text-white min-h-screen overflow-x-hidden">
      <section className="text-center">
        <header className="pb-10">
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight break-words">Más buscados/populares</h2>
          <p className="text-gray-400 text-sm">Las últimas películas en cines.</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {/* Spinner */
            loading ? (
              <div className="flex justify-center">
                <ThreeDot color={["#dc2626"]} className="text-center" />
              </div>
            ) : (
              movies.map((movie, idx) => (
                <DVDCard
                  wishlist={wishlist}
                  key={`${movie.id}-${idx}`}
                  imdb_id={movie.imdb_id}
                  title={movie.title}
                  saved={wishlist.some(wishlistmovie => parseInt(wishlistmovie.movie_details.imdb_id) === parseInt(movie.id))}
                  image={movie.poster_url}
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

    </div>
  );
}

export default Famous;
