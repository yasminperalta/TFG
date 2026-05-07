import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getYourCollections } from "../services/collectionService";

function MovieSelectionModal({ detectedMovies, onSaveSelected, onClose }) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [existingIds, setExistingIds] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Cargar IDs existentes desde backend
  useEffect(() => {
    const loadExistingIds = async () => {
      if (!isAuthenticated) {
        setExistingIds(new Set());
        // Si no está autenticado, seleccionar todas por defecto
        setSelectedIds(new Set(detectedMovies.map(m => m.imdb_id)));
        return;
      }
      try {
        const token = await getAccessTokenSilently();
        const collections = await getYourCollections(token);
        const miColeccion = collections.find(col => col.name === "Mi colección");
        if (miColeccion) {
          const ids = new Set(
            miColeccion.movies.map(m => 
              String(m.movie_details?.imdb_id || m.imdb_id)
            )
          );
          setExistingIds(ids);
          
          // Pre-seleccionar solo las que no existen
          const newSelected = new Set(
            detectedMovies
              .filter(m => !ids.has(m.imdb_id))
              .map(m => m.imdb_id)
          );
          setSelectedIds(newSelected);
        } else {
          // Si no hay colección, seleccionar todas
          setSelectedIds(new Set(detectedMovies.map(m => m.imdb_id)));
        }
      } catch (error) {
        console.error("Error cargando colección:", error);
        setExistingIds(new Set());
        setSelectedIds(new Set(detectedMovies.map(m => m.imdb_id)));
      }
    };

    loadExistingIds();
  }, [detectedMovies, isAuthenticated, getAccessTokenSilently]);

  const toggleSelection = (movieImdbId) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(movieImdbId)) {
      newSelection.delete(movieImdbId);
    } else {
      newSelection.add(movieImdbId);
    }
    setSelectedIds(newSelection);
  };

  const handleSave = () => {
    const moviesToSave = detectedMovies.filter(m => selectedIds.has(m.imdb_id));
    onSaveSelected(moviesToSave);
  };

  const selectAll = () => {
    const availableMovies = detectedMovies.filter(m => !existingIds.has(m.imdb_id));
    setSelectedIds(new Set(availableMovies.map(m => m.imdb_id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            Seleccionar películas para guardar
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-gray-300 mb-4">
          Se encontraron {detectedMovies.length} películas. Selecciona cuáles quieres añadir a "Mi colección".
        </p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={selectAll}
            className="text-sm bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 rounded transition"
          >
            Seleccionar todas
          </button>
          <button
            onClick={deselectAll}
            className="text-sm bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-1 rounded transition"
          >
            Deseleccionar todas
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {detectedMovies.map((movie) => {
            const isAlreadyInCollection = existingIds.has(movie.imdb_id);
            const isSelected = selectedIds.has(movie.imdb_id);

            return (
              <div
                key={movie.imdb_id || movie.id}
                className={`flex items-center gap-4 p-3 rounded-lg border transition ${
                  isAlreadyInCollection
                    ? 'bg-neutral-800 border-neutral-700 opacity-60'
                    : isSelected
                      ? 'bg-neutral-800 border-[#E50914]'
                      : 'bg-neutral-800 border-neutral-700 hover:border-neutral-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelection(movie.imdb_id)}
                  disabled={isAlreadyInCollection}
                  className="w-5 h-5 cursor-pointer"
                />
                <img
                  src={movie.image || "https://via.placeholder.com/60x90"}
                  alt={movie.title}
                  className="w-10 h-14 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{movie.title}</p>
                  {isAlreadyInCollection && (
                    <p className="text-yellow-500 text-sm">Ya en tu colección</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">
            {selectedIds.size} de {detectedMovies.filter(m => !existingIds.has(m.imdb_id)).length} seleccionadas
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={selectedIds.size === 0}
              className="px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar seleccionadas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieSelectionModal;
