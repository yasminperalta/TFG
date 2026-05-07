import { useState } from 'react';
import { analizar_imagen } from '../services/gemini';
import Carousel from './Carousel';
import MovieSelectionModal from './MovieSelectionModal';

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

  // Guardar películas seleccionadas en "Mi colección"
  const handleSaveSelectedMovies = (selectedMovies) => {
    // Obtener colección actual
    let collections = JSON.parse(localStorage.getItem('collections') || '[]');
    let collection = collections.find(col => col.id === 1);

    if (!collection) {
      collection = {
        id: 1,
        name: 'Mi colección',
        movies: [],
        isPublic: false
      };
      collections.push(collection);
    }

    // Obtener IDs existentes para evitar duplicados
    const existingIds = new Set(collection.movies.map(m => m.imdb_id.toString()));

    // Filtrar y mapear películas seleccionadas que no estén ya en la colección
    const newMovies = selectedMovies
      .filter(m => !existingIds.has(m.id.toString()))
      .map(m => ({
        imdb_id: m.id.toString(),
        title: m.title,
        image: m.image
      }));

    if (newMovies.length === 0) {
      // Todas las películas seleccionadas ya estaban en la colección
      setShowSelectionModal(false);
      setPendingMovies([]);
      return;
    }

    // Actualizar colección
    collection.movies = [...collection.movies, ...newMovies];
    collections = [collection, ...collections.filter(col => col.id !== 1)];

    localStorage.setItem('collections', JSON.stringify(collections));

    // Actualizar resultados mostrados
    setResults(selectedMovies);

    // Cerrar modal
    setShowSelectionModal(false);
    setPendingMovies([]);

     // Notificar cambios a otros componentes
     window.dispatchEvent(new Event('storage'));
     window.dispatchEvent(new Event('collectionsChanged'));
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
