import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Scroll from "../components/Scroll";
import Carousel from "../components/Carousel";
import { FaGlobe, FaLock } from "react-icons/fa";
import { getCollectionById } from "../services/collectionService";

function SharedCollection() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSharedCollection = async () => {
      try {
        const data = await getCollectionById(id);
        if (data && data.is_public) {
          setCollection(data);
        }
      } catch (error) {
        console.error("Error cargando colección compartida:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSharedCollection();
  }, [id]);

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

  const movies = collection.movies?.map(m => ({
    id: parseInt(m.movie_details?.imdb_id || m.imdb_id),
    title: m.movie_details?.title || m.title,
    image: m.movie_details?.poster_url || m.image
  })) || [];

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
      <div className="absolute inset-0 bg-black opacity-85"></div>

      <section className="relative text-center mt-12 p-10">
        <div className="flex items-center justify-center gap-3 mb-5">
          <h2 className="text-4xl">{collection.name}</h2>
          <span
            className="text-gray-400"
            title={collection.is_public ? "Pública" : "Privada"}
          >
            {collection.is_public ? <FaGlobe /> : <FaLock />}
          </span>
        </div>
        <p className="mb-8">{movies.length} películas</p>

        {movies.length > 0 ? (
          <Carousel movies={movies} maxVisible={5} />
        ) : (
          <p className="text-gray-400">Esta lista está vacía.</p>
        )}
      </section>

      <Scroll />
    </div>
  );
}

export default SharedCollection;
