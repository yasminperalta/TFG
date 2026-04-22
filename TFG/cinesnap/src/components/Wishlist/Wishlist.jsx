import { useEffect, useState } from "react";
import WishlistItem from "./WishlistItem";
import Scroll from "../Scroll";
import { getWishlistMovies } from "../../services/wishlistService";
import { useAuth0 } from "@auth0/auth0-react";

function Wishlist() {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  const buildStoreUrl = (store, title) => {
    const query = encodeURIComponent(title).replace(/%20/g, "+");

    switch (store) {
      case "fnac":
        return `https://www.fnac.es/SearchResult/ResultList.aspx?Search=${query}&sft=1&sa=0`;

      case "amazon":
        return `https://www.amazon.es/s?k=${query}`;

      default:
        return "#";
    }
  };

  const [movies, setMovies] = useState([]);

  // Cuando se carga la página se lanza este evento que carga las películas
  // directamente desde la base de datos
  useEffect(() => {
    const loadWishlistMovies = async function () {
      const token = await getAccessTokenSilently();

      const dbmovies = await getWishlistMovies(token);

      setMovies((prevMovies) => {
        const allMovies = [...prevMovies, ...dbmovies];
        // Filtramos para quedarnos solo con la primera aparición de cada ID,
        // esto porque React lanza useEffect DOS veces cuando inicias el script dev
        const uniqueMovies = allMovies.filter((movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
        );

        console.log(uniqueMovies);
        return uniqueMovies;
      });
    }

    if (isAuthenticated) {
      loadWishlistMovies();
    }
  }, [isAuthenticated]);

  const removeMovie = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };
  return (
    <div className="relative min-h-screen m-0 font-sans text-white">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>

      {/* Overlay negro para oscurecer */}
      <div className="absolute inset-0 bg-black opacity-85"></div>
      {/* Ajusta opacity-50 a 60 o 70 para más oscuridad */}

      {/* Contenido principal */}
      <section className="relative text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">Lista de deseados</h2>
        <p>
          Aquí puedes ver las películas que has añadido a tu lista de deseados.
        </p>
        <div className="flex flex-col gap-4 mt-8 max-w-4xl mx-auto">
          {movies.map((movie) => (
            <WishlistItem
              key={movie.id}
              title={movie.title}
              date={movie.date}
              poster_url={movie.poster_url}
              stores={[
                {
                  logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Fnac_Logo.svg",
                  name: "Fnac",
                  link: buildStoreUrl("fnac", movie.title),
                },
                {
                  logo: "https://cdn-gdjgd.nitrocdn.com/puszgbaFBTTMTmzNUiCrRdNAekkabGtJ/assets/images/optimized/rev-01693b6/policyviz.com/wp-content/uploads/2020/12/amazon-logo-square-285x300.jpg",
                  name: "Amazon",
                  link: buildStoreUrl("amazon", movie.title),
                },
              ]}
              onRemove={() => removeMovie(movie.id)}
            />
          ))}
        </div>
      </section>
      {/* Botón Volver arriba */}
      <Scroll />
    </div>
  );
}

export default Wishlist;
