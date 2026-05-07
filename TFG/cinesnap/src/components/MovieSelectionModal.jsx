import { useState } from "react";

function MovieSelectionModal({ detectedMovies, onSaveSelected, onClose }) {
  // Calcular IDs existentes desde localStorage (solo una vez al montar)
  const getExistingIds = () => {
    const collections = JSON.parse(localStorage.getItem("collections") || "[]");
    const miColeccion = collections.find(col => col.id === 1);
    if (miColeccion) {
      return new Set(miColeccion.movies.map(m => m.imdb_id.toString()));
    }
    return new Set();
  };

  const existingIds = getExistingIds();

  // Pre-seleccionar solo las películas que no están ya en la colección
  const getInitialSelectedIds = () => {
    return new Set(
      detectedMovies
        .filter(m => !existingIds.has(m.id.toString()))
        .map(m => m.id.toString())
    );
  };

  const [selectedIds, setSelectedIds] = useState(getInitialSelectedIds);

  const toggleSelection = (movieId) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(movieId)) {
      newSelection.delete(movieId);
    } else {
      newSelection.add(movieId);
    }
    setSelectedIds(newSelection);
  };

  const handleSave = () => {
    const moviesToSave = detectedMovies.filter(m => selectedIds.has(m.id.toString()));
    onSaveSelected(moviesToSave);
  };

  const selectAll = () => {
    setSelectedIds(new Set(detectedMovies.map(m => m.id.toString())));
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
            const isAlreadyInCollection = existingIds.has(movie.id.toString());
            const isSelected = selectedIds.has(movie.id.toString());

            return (
              <div
                key={movie.id}
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
                  onChange={() => toggleSelection(movie.id.toString())}
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
            {selectedIds.size} de {detectedMovies.length} seleccionadas
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
