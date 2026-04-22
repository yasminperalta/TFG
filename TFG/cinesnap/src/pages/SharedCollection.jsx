import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Scroll from "../components/Scroll";
import Carousel from "../components/Carousel";
import { FaGlobe, FaLock } from "react-icons/fa";

function SharedCollection() {
  const { id } = useParams();
  // Estado para guardar la colección encontrada
  const [collection, setCollection] = useState(null);
  // Estado para controlar si está cargando
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función que carga la colección desde localStorage
    const loadSharedCollection = () => {
      const saved = localStorage.getItem("collections");

      if (saved) {
        const collections = JSON.parse(saved);
        // Busca la colección cuyo id coincida con el de la URLx
        const found = collections.find((col) => col.id === parseInt(id));

        if (found && found.isPublic) {
          // Solo se muestra si existe Y es pública
          setCollection(found);
        }
      }

      setLoading(false);
    };

    loadSharedCollection();
  }, [id]); // Se ejecuta cuando cambia el id

  if (loading) {
    return (
      <div className="relative min-h-screen text-white">
        <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
        <div className="absolute inset-0 bg-black opacity-85"></div>

        <div className="relative text-center mt-12 p-10">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no existe o es privada
  if (!collection) {
    return (
      <div className="relative min-h-screen text-white">
        <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
        <div className="absolute inset-0 bg-black opacity-85"></div>

        <div className="relative text-center mt-12 p-10">
          <h2 className="text-4xl mb-5">Lista no encontrada</h2>
          <p>La lista no existe o es privada.</p>
        </div>

        <Scroll />
      </div>
    );
  }
  // Render principal si la colección existe
  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
      <div className="absolute inset-0 bg-black opacity-85"></div>

      <section className="relative text-center mt-12 p-10">
        <div className="flex items-center justify-center gap-3 mb-5">
          <h2 className="text-4xl">{collection.name}</h2>
          {/* Icono cambia según si es pública o privada */}
          <span
            className="text-gray-400"
            title={collection.isPublic ? "Pública" : "Privada"}
          >
            {collection.isPublic ? <FaGlobe /> : <FaLock />}
          </span>
        </div>
        {/* Número de películas */}
        <p className="mb-8">{collection.movies.length} películas</p>

        {/* Si hay películas, muestra el carrusel */}
        {collection.movies.length > 0 ? (
          <Carousel movies={collection.movies} maxVisible={5} /> // Número de elementos visibles a la vez
        ) : (
          <p className="text-gray-400">Esta lista está vacía.</p>
        )}
      </section>

      <Scroll />
    </div>
  );
}

export default SharedCollection;
