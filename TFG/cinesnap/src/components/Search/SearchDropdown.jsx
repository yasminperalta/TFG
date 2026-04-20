import { useEffect, useState, useRef } from "react";
import { searchMovies } from "../../services/tmdb";

function SearchDropdown({ query, onSelect }) {
  // Estado para sugerencias de búsqueda (API)
  const [suggestions, setSuggestions] = useState([]);
  // Estado para búsquedas recientes (localStorage)
  const [recent, setRecent] = useState([]);
  // Índice activo para navegación con hover/teclado
  const [activeIndex, setActiveIndex] = useState(-1);
  // Controla si el dropdown está visible
  const [isOpen, setIsOpen] = useState(false);
  // Referencia al contenedor del dropdown para detectar clicks fuera
  const dropdownRef = useRef(null);

  // Cargar búsquedas recientes al abrir el dropdown
  useEffect(() => {
    if (isOpen) {
      const stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
      setRecent(stored);
    }
  }, [isOpen]);

  // Lógica de búsqueda (API + debounce + abort)
  useEffect(() => {
    // Si no hay query o es muy corta, mostrar recientes
    if (!query || query.length < 2) {
      setSuggestions([]);
      setActiveIndex(-1);
      // abrir dropdown solo si hay recientes
      setIsOpen(recent.length > 0);
      return;
    }

    // Abrir dropdown si hay query válida
    setIsOpen(true);

    // Permite cancelar request anterior si el usuario sigue escribiendo
    const controller = new AbortController();

    // Debounce: espera 300ms antes de llamar API
    const delay = setTimeout(async () => {
      try {
        const results = await searchMovies(query, {
          signal: controller.signal,
        });

        // Limita resultados a 5 sugerencias
        setSuggestions(results.slice(0, 5));
        setActiveIndex(-1); // Reset selección activa
      } catch (err) {
        // Ignora errores de cancelación (AbortController)
        if (err.name !== "AbortError") console.error(err);
      }
    }, 300);

    // Cleanup: limpia timeout y cancela request si cambia query
    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [query]);

  // Cerrar dropdown si haces click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Guardar búsqueda en localStorage
  const saveRecent = (text) => {
    if (!text) return;

    let stored = JSON.parse(localStorage.getItem("recentSearches")) || [];

    stored = [text, ...stored.filter((t) => t !== text)].slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(stored));
    setRecent(stored);
  };

  // Manejo de selección de item
  const handleSelect = (text) => {
    if (!text) return;

    saveRecent(text); // guarda en recientes
    onSelect(text); // notifica al componente padre

    // cierra dropdown y limpia estado
    setIsOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  // Decide qué mostrar:
  // - si hay query → suggestions
  // - si no hay query → recientes
  const listToShow = query?.length >= 2 ? suggestions : recent;

  // Si no debe mostrarse nada → no renderiza
  if (!isOpen || (!query && recent.length === 0)) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-[60px] w-full bg-neutral-800 rounded-md shadow-lg z-50"
      tabIndex={-1}
    >
      {/* Título de recientes */}
      {!query && recent.length > 0 && (
        <p className="px-4 py-2 text-gray-300 text-sm font-medium">Recientes</p>
      )}
      {/* Lista de sugerencias o recientes */}
      {listToShow.map((item, index) => {
        // Puede venir como string (recent) o objeto (API)
        const text = item?.title || item;

        return (
          <div
            key={index}
            onClick={() => handleSelect(text)}
            onMouseEnter={() => setActiveIndex(index)}
            className={`px-4 py-2 cursor-pointer transition-colors text-gray-100 ${
              activeIndex === index
                ? "bg-neutral-600 text-white" // activo
                : "hover:bg-neutral-700" // hover normal
            }`}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}

export default SearchDropdown;
