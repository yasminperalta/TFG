import DVDCard from "./DVDCard";
import { useEffect, useState } from "react";
import { getPopularMovies } from "../services/tmdb";
import Scroll from "./Scroll";

function Famous() {
  const [movies, setMovies] = useState([]);

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

  return (
    <div className="m-0 font-sans bg-neutral-900 text-white min-h-screen">
      <section className="text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">Más buscados/populares</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 justify-center">
          {movies.map((movie) => (
            <DVDCard key={movie.id} title={movie.title} image={movie.image} />
          ))}
        </div>
        {/* Botón Mostrar más */}
        <button
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