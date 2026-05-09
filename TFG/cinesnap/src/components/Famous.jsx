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

  useEffect(() => {
    console.log(wishlist);
  }, [wishlist]);

  // CARGAR PELÍCULAS INICIALES
  const loadMovies = async () => {
    try {
      const popularMovies = await getPopularMovies(1);
      setMovies(popularMovies);
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

      setMovies((prev) => [...prev, ...newMovies]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error cargando más películas:", error);
    }
  };

  // CARGA DE COLECCIONES con migración de IDs
  const loadCollections = async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getYourCollections(token);

      setCollections((prevCollections) => {
        const allCollections = [...prevCollections, ...data];
        // Filtramos para quedarnos solo con la primera aparición de cada ID,
        // esto porque React lanza useEffect DOS veces cuando inicias el script dev
        const uniqueCollections = allCollections.filter((collection, index, self) =>
          index === self.findIndex((c) => c.id === collection.id)
        );

        setLoading(false);
        return uniqueCollections;
      });

    } catch (error) {
      console.error("Error recuperando tus colecciones:", error);
    }
  };

  return (
    <div className="m-0 font-sans bg-white/5 backdrop-blur-xl hover:bg-white/2 p-6 rounded-3xl transition-all border border-white/5 text-white min-h-screen">
      <section className="text-center">
        <h2 className="text-4xl pt-5 pb-10 tracking-tight">Más buscados/populares</h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
          {/* Spinner */
            loading ? (
              <div className="flex justify-center">
                <ThreeDot color={["#dc2626"]} className="text-center" />
              </div>
            ) : (
              movies.map((movie) => (
                <DVDCard
                  wishlist={wishlist}
                  key={movie.id}
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
