import DVDCard from "./DVDCard";
import { useEffect, useState } from "react";
import { getPopularMovies } from "../services/tmdb";

function Famous() {
  const [movies, setMovies] = useState([]);
  const [showTop, setShowTop] = useState(false); // botón volver arriba

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-red-600 w-14 h-14 flex items-center justify-center rounded-full shadow-xl hover:bg-red-700 transition transform hover:scale-110"
        >
          <span className="text-white text-3xl">⬆</span>
        </button>
      )}
    </div>
  );
}

export default Famous;