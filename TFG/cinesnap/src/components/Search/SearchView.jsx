import { useEffect, useState } from "react";
import { getWishlistMovies } from "../../services/wishlistService";
import DVDCard from "../DVDCard";
import { useAuth0 } from "@auth0/auth0-react";
import { ThreeDot } from "react-loading-indicators";

function SearchView({ urlQuery, movies, loading }) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [wishlist, setWishlist] = useState([]);

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
    if (isAuthenticated) {
      loadWishlistMovies();
    }
  }, [isAuthenticated, getAccessTokenSilently]); // Wishlist eliminada de aquí

  return (
    <div className="text-white min-h-screen p-6 pt-20">
      <h2 className="text-3xl mb-6 font-bold tracking-tight">
        Resultados para: <span className="text-[#ff6347]">{urlQuery}</span>
      </h2>

      {/* Estado: loading */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <ThreeDot color={["#dc2626"]} />
        </div>
      ) : movies.length === 0 ? (
        /* Estado: sin resultados */
        <p>No se encontraron resultados</p>
      ) : (
        /* Grid de peliculas */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
          {movies.map((movie) => (
            <DVDCard
              wishlist={wishlist}
              key={movie.id}
              imdb_id={movie.imdb_id}
              title={movie.title}
              image={movie.poster_url}
              shareLink={`https://www.themoviedb.org/movie/${movie.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchView;
