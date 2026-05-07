import { useState } from 'react';
import { analizar_imagen } from '../services/gemini';
import Carousel from './Carousel';
import MovieSelectionModal from './MovieSelectionModal';
import { useAuth0 } from '@auth0/auth0-react';
import { getYourCollections, addMovieToCollection, createCollection } from '../services/collectionService';

function UploadImage() {
  // Lista de películas detectadas
  const [results, setResults] = useState([]);
  // Estado de carga mientras se procesa la imagen
  const [loading, setLoading] = useState(false);
  // Estado para errores
  const [error, setError] = useState(null);
  // Estado para mostrar modal de selección
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  // Películas detectadas pendientes de guardar
  const [pendingMovies, setPendingMovies] = useState([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // PROCESAR IMAGEN
  const handleProcessImage = async () => {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput?.files[0];

    // Si no hay archivo seleccionado
    if (!file) {
      setError('Por favor seleccione una imagen primero');
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Envía la imagen al gemini para analizarla
      const movieTitles = await analizar_imagen(file);

      if (movieTitles.length === 0) {
        setError('No se encontraron películas en la imagen.');
        return;
      }

      // Guardar las películas detectadas en estado y mostrar modal de selección
      setPendingMovies(movieTitles);
      setShowSelectionModal(true);

    } catch (err) {
      setError('Error al procesar la imagen. Por favor intente nuevamente.');
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Guardar películas seleccionadas en "Mi colección" usando backend
  const handleSaveSelectedMovies = async (selectedMovies) => {
    if (!isAuthenticated || selectedMovies.length === 0) {
      setShowSelectionModal(false);
      setPendingMovies([]);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      
      // Obtener colecciones del usuario para encontrar "Mi colección"
      const userCollections = await getYourCollections(token);
      let myCollection = userCollections.find(col => col.name === 'Mi colección');
      
      if (!myCollection) {
        // Crear "Mi colección" si no existe
        myCollection = await createCollection(token, { 
          name: 'Mi colección', 
          is_public: false 
        });
      }

      // Obtener IDs de películas ya existentes en la colección
      const existingIds = new Set(
        myCollection.movies.map(m => 
          String(m.movie_details?.imdb_id || m.imdb_id)
        )
      );

      // Filtrar películas que no están ya en la colección
      const newMovies = selectedMovies.filter(m => 
        !existingIds.has(String(m.imdb_id))
      );

      if (newMovies.length === 0) {
        setShowSelectionModal(false);
        setPendingMovies([]);
        return;
      }

// Añadir cada película a la colección
       for (const movie of newMovies) {
         await addMovieToCollection(token, myCollection.id, movie.imdb_id, {
           title: movie.title,
           image: movie.image
         });
       }

      // Actualizar resultados mostrados
      setResults(selectedMovies);

      // Cerrar modal
      setShowSelectionModal(false);
      setPendingMovies([]);

    } catch (error) {
      console.error("Error guardando películas:", error);
      setError('Error al guardar películas en la colección');
    }
  };

  return (
    <section className="text-center mb-12">
      <h1 className="text-5xl leading-tight mb-4">
        Escanea tu colección de DVDs
      </h1>
      <h2 className="text-lg mb-6">
        Suba un archivo! Lo escanearemos y mostraremos la colección
      </h2>
      <div className="border-[5px] border-white p-2">
        <input type="file" accept="image/*" />
      </div>
      <br />
      <button 
        onClick={handleProcessImage}
        disabled={loading}
        className="bg-[#E50914] text-white px-5 py-2 cursor-pointer hover:bg-red-700 transition rounded"
      >
        {loading ? 'Procesando...' : 'Procesar imagen'}
      </button>
      
       {error && (
         <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700">
           {error}
         </div>
       )}

       {results.length > 0 && (
         <div className="mt-6">
           <h2 className="text-xl font-semibold mb-3 text-white text-center">
             Se añadieron las siguientes películas a tu colección:
           </h2>
           <Carousel movies={results} maxVisible={5} />
         </div>
       )}

       {showSelectionModal && (
         <MovieSelectionModal
           detectedMovies={pendingMovies}
           onSaveSelected={handleSaveSelectedMovies}
           onClose={() => {
             setShowSelectionModal(false);
             setPendingMovies([]);
           }}
         />
       )}
     </section>
   );
 }
 
 export default UploadImage;