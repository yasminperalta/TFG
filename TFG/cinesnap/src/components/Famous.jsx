import DVDCard from "./DVDCard";
import { useEffect, useState } from "react";
import { getPopularMovies } from "../services/tmdb";
import Scroll from "./Scroll";
import { useSearch } from "../context/search"; // Importamos el contexto de búsqueda

function Famous() {
  const [movies, setMovies] = useState([]);
  const { query } = useSearch(); // usamos la búsqueda global
  const [setWishlist] = useState([]);

  const handleAddToWishlist = (movie) => {
    setWishlist((prev) => [...prev, movie]);
  };

  useEffect(() => {
    // Cargar películas iniciales
    const loadMovies = async () => {
      try {
        const initialMovies = await getPopularMovies(1);
        setMovies(initialMovies);
      } catch (error) {
        console.error("Error cargando películas:", error);
      }
    };
    loadMovies();
  }, []);

  const normalizeText = (text) =>
    text
      .normalize("NFD") // Descompone letras con acentos
      .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
      .toLowerCase();

  const filteredMovies = movies.filter((movie) =>
    normalizeText(movie.title).includes(normalizeText(query)),
  );

  return (
    <div className="m-0 font-sans bg-neutral-900 text-white min-h-screen">
      <section className="text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">Más buscados/populares</h2>
        <div className="grid grid-cols-6 gap-6 justify-center">
          {filteredMovies.map((movie) => (
            <DVDCard
              key={movie.id}
              title={movie.title}
              image={movie.image}
              onAddToWishlist={handleAddToWishlist}
              shareLink={`https://www.themoviedb.org/movie/${movie.id}`}
            />
          ))}
        </div>
        {/* Botón Mostrar más */}
        <button className="mt-8 px-6 py-3 bg-indigo-600 rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
          Mostrar más
        </button>
      </section>

      {/* Botón Volver arriba */}
      <Scroll />
    </div>
  );
}

export default Famous;