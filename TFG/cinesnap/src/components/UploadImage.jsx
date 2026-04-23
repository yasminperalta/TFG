import { useState } from 'react';
import { analizar_imagen } from '../services/gemini';

function UploadImage() {
   // Lista de películas detectadas
  const [results, setResults] = useState([]);
  // Estado de carga mientras se procesa la imagen
  const [loading, setLoading] = useState(false);
  // Estado para errores
  const [error, setError] = useState(null);

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
      // Envía la imagen a al gemini  para analizarla
      const movieTitles = await analizar_imagen(file);
      setResults(movieTitles);
    } catch (err) {
      setError('Error al procesar la imagen. Por favor intente nuevamente.');
      console.error(err);
      // limpia resultados en caso de fallo
      setResults([]);
    } finally {
      setLoading(false);
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
        <div className="mt-6 p-4 bg-gray-800 border border-gray-600 rounded">
          <h2 className="text-xl font-semibold mb-3 text-white">Películas identificadas:</h2>
          <ul className="list-disc list-inside space-y-1 text-white">
            {results.map((movie, index) => (
              <li key={index}>{movie}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default UploadImage;
