import { useEffect, useState } from "react";
import WishlistItem from "./WishlistItem";
import Scroll from "../Scroll";
import { getWishlistMovies, getDvdPrices } from "../../services/wishlistService";
import { useAuth0 } from "@auth0/auth0-react";
import { ThreeDot } from "react-loading-indicators";

function Wishlist() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [moviesWithStores, setMoviesWithStores] = useState([]);

  const loadWishlistMovies = async function () {
    setLoading(true);
    const token = await getAccessTokenSilently();
    const dbmovies = await getWishlistMovies(token);
    setWishlist(dbmovies);

    /*
    const moviesWithPrices = await Promise.all(
      dbmovies.map(async (movie) => {
        const stores = await getDvdPrices(movie.movie_details.title);
        return {
          ...movie,
          stores
        };
      })
    );
    setMoviesWithStores(moviesWithPrices);
    */

    setLoading(false);
  }
  useEffect(() => {
    console.log("WISHLIST:");
    console.log(wishlist);
  }, [wishlist]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlistMovies();
    }
  }, [isAuthenticated]);

  return (
    <div className="relative min-h-screen m-0 font-sans text-white">

      {/* Contenido principal */}
      <section className="relative text-left mt-12 p-10">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Lista de deseados</h2>
        <p className="text-gray-400">
          Aquí puedes ver las películas que has añadido a tu lista de deseados.
        </p>
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6 text-center">
          {/* Spinner */
            loading ? (
              <div className="col-span-2">
                <ThreeDot color={["#dc2626"]} className="text-center" />
              </div>
            ) : (
              wishlist.map((movie) => (
                <WishlistItem
                  key={movie.movie_details.id}
                  imdb_id={movie.movie_details.imdb_id}
                  title={movie.movie_details.title}
                  date={movie.movie_details.date}
                  poster_url={movie.movie_details.poster_url}
                  wishlist_movie_id={movie.id}
                  stores={movie.stores}
                />
              )))}
        </div>
      </section>
      {/* Botón Volver arriba */}
      <Scroll />
    </div>
  );
}

export default Wishlist;