import { useState, useEffect } from 'react';
import { analizar_imagen } from '../services/gemini';
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
  // Estado para drag and drop
  const [isDragging, setIsDragging] = useState(false);
  // Archivo seleccionado para previsualizar
  const [selectedFile, setSelectedFile] = useState(null);
  // URL de previsualización
  const [previewUrl, setPreviewUrl] = useState(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Limpiar URL del objeto cuando cambie o se desmonte
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Manejar archivo seleccionado (por input o drag & drop) - solo previsualizar
  const handleFileSelect = (file) => {
    if (!file) {
      setError('Por favor seleccione una imagen primero');
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setSelectedFile(null);
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor seleccione un archivo de imagen válido');
      return;
    }

    // Limpiar URL anterior si existe
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Crear URL de previsualización
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    setError(null);
  };

  // PROCESAR IMAGEN - se ejecuta al hacer clic en el botón
  const handleProcessImage = async () => {
    if (!selectedFile) {
      setError('Por favor seleccione una imagen primero');
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const movieTitles = await analizar_imagen(selectedFile);

      if (movieTitles.length === 0) {
        setError('No se encontraron películas en la imagen.');
        return;
      }

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

  // Eventos de drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const fileInput = document.querySelector('input[type="file"]');
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      handleFileSelect(file);
    }
  };
  const handleSaveSelectedMovies = async (selectedMovies) => {
    if (!isAuthenticated || selectedMovies.length === 0) {
      setShowSelectionModal(false);
      setPendingMovies([]);
      return;
    }

    setLoading(true);
    setError(null);

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

      // Verificar que myCollection tiene id
      if (!myCollection || !myCollection.id) {
        throw new Error('No se pudo obtener la colección');
      }

      // Obtener IDs de películas ya existentes en la colección
      const existingIds = new Set(
        (myCollection.movies || []).map(m =>
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
        setLoading(false);
        return;
      }

      // Añadir cada película a la colección
      for (const movie of newMovies) {
        await addMovieToCollection(token, myCollection.id, movie.imdb_id, {
          title: movie.title,
          image: movie.image
        });
      }

      // Mostrar películas guardadas en el carousel
      setResults(selectedMovies);

      // Limpiar previsualización después de guardar
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setSelectedFile(null);

      // Cerrar modal
      setShowSelectionModal(false);
      setPendingMovies([]);

    } catch (error) {
      console.error("Error guardando películas:", error);
      setError('Error al guardar películas en la colección: ' + (error.message || 'Intente nuevamente'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="text-center mb-12 max-w-2xl mx-auto px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
        Escanea tu colección de DVDs
      </h1>
      <p className="text-gray-400 text-lg mb-8">
        Sube una foto de tus estanterías. Nosotros nos encargamos de identificar cada título.
      </p>

{/* Contenedor del Input de Archivo */}
       <div className="relative group">
         <label
           className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8
              flex flex-col items-center justify-center w-full h-64
              border-2 border-dashed rounded-2xl cursor-pointer
              transition-all duration-300 ease-in-out
              ${isDragging ? 'border-[#E50914] bg-gray-800/60' : loading ? 'border-gray-600 bg-gray-800/50' : 'border-gray-700 bg-gray-900/40 hover:bg-gray-800/60 hover:border-[#E50914]/50'}
            `}
           onDragEnter={handleDragEnter}
           onDragLeave={handleDragLeave}
           onDragOver={handleDragOver}
           onDrop={handleDrop}
         >
           {previewUrl ? (
             <div className="flex flex-col items-center justify-center">
               <img
                 src={previewUrl}
                 alt="Previsualización"
                 className="max-h-48 max-w-full object-contain rounded-lg shadow-lg mb-2"
               />
               <button
                 onClick={(e) => {
                   e.stopPropagation();
                   URL.revokeObjectURL(previewUrl);
                   setPreviewUrl(null);
                   setSelectedFile(null);
                   setError(null);
                 }}
                 className="mt-2 text-sm text-gray-400 hover:text-white underline"
               >
                 Cambiar imagen
               </button>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center pt-5 pb-6">
               {/* Icono decorativo */}
               <svg className="w-12 h-12 mb-4 text-gray-500 group-hover:text-[#E50914] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
               </svg>
               <p className="mb-2 text-sm text-gray-400">
                 <span className="font-semibold text-white">{isDragging ? 'Suelta la imagen aquí' : 'Haz clic para subir'} </span>
                 {!isDragging && 'o arrastra y suelta'}
               </p>
               <p className="text-xs text-gray-500">PNG, JPG o WEBP (Máx. 10MB)</p>
             </div>
           )}

           <input
             type="file"
             accept="image/*"
             className="hidden"
             onChange={(e) => {
               if (e.target.files && e.target.files[0]) {
                 handleFileSelect(e.target.files[0]);
               }
             }}
           />
         </label>
       </div>

      <div className="mt-8">
        <button
          onClick={handleProcessImage}
          disabled={loading}
          className={`
        w-full md:w-auto px-10 py-4 font-bold text-white rounded-full
        transition-all duration-300 transform active:scale-95
        ${loading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-[#E50914] hover:bg-[#b2070f] hover:shadow-[0_0_20px_rgba(229,9,20,0.4)]'}
      `}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : 'Escanear Ahora'}
        </button>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-900/20 border border-red-500/50 text-red-200 text-sm animate-pulse">
          {error}
        </div>
      )}

{/* Mensaje de Éxito */}
       {results.length > 0 && (
         <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/50 text-white text-sm text-center">
           ¡Películas añadidas a tu colección!
         </div>
       )}

      {/* Modal (Se mantiene lógica, se asume que tiene sus propios estilos) */}
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