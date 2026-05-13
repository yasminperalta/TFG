import { NavLink, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Importamos Auth0
import { useSearch } from "../context/search"; // Importamos el contexto de búsqueda
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { syncUserWithDatabase } from "../services/authService";
import SearchDropdown from "../components/Search/SearchDropdown";

function Navbar() {
  const { query, setQuery } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  // Obtener el usuario desde el contexto de autenticación
  // Si user existe → el usuario está logueado
  // Si user es null → el usuario no está logueado
  // Extraemos lo necesario de Auth0
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    user,
  } = useAuth0();
  // const navigate = useNavigate();

  const handleLogout = () => {
    // Auth0 maneja la redirección a la URL de origen automáticamente
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("HOLA");
      const token = getAccessTokenSilently();
      syncUserWithDatabase(token, user);
    }
  }, [isAuthenticated, user]);

  // Input de búsqueda sincronizado con URL
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // actualiza estado global de búsqueda
  };
  // Selección de una búsqueda (click o enter)
  const handleSelect = (text) => {
    if (!text.trim()) return;

    // guardar en localStorage recientes
    let stored = JSON.parse(localStorage.getItem("recentSearches")) || [];
    stored = [text, ...stored.filter((q) => q !== text)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(stored));
    // actualizar estado global
    setQuery(text);
    // navegar a página de resultados
    navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  const handleClear = () => {
    setQuery("");
    setSearchParams({});
  };

  // Estado para controlar el menú móvil
  const [menuOpen, setMenuOpen] = useState(false);

  const baseLink =
    "p-5 text-white no-underline hover:text-[#ff6347] transition";

  const activeLink = "text-[#ff6347] font-bold border-b-2 border-[#ff6347]";

  return (
    <header className="fixed top-0 left-0 w-full h-[70px] bg-neutral-800 flex items-center justify-between px-4 md:px-10 z-50">
      <div className="text-3xl font-bold text-white">
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/DioTeca_logo.svg" className="w-12 h-12" alt="" srcSet="" />
          <span>DioTeca</span>
        </NavLink>
      </div>
      {/* Buscador */}
      <div
        className="relative flex items-center bg-neutral-700 rounded-md px-4 py-2 gap-3 flex-1 max-w-md mx-2
                      focus-within:ring-2 focus-within:ring-[#ff6347]"
      >
        {/* Icono lupa */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-4.35-4.35m1.85-5.4a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0Z"
          />
        </svg>

        {/* Input */}
        <input
          type="text"
          placeholder="Buscar películas..."
          className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
          value={query}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSelect(query);
            }
          }}
        />
        {/* Botón limpiar */}
        {query && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-white transition"
          >
            <FaTimes />
          </button>
        )}

        {/* Dropdown de sugerencias */}
        <SearchDropdown query={query} onSelect={handleSelect} />
      </div>

      <button
        className="text-white text-2xl md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <nav
        className={`absolute md:static top-[70px] left-0 w-full md:w-auto 
                  bg-neutral-800 md:bg-transparent
                  flex flex-col md:flex-row items-center gap-4 p-5 md:p-0
                  transition-all duration-300
            ${menuOpen ? "block" : "hidden"} md:flex
        `}
      >
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : ""}`
          }
        >
          Inicio
        </NavLink>
        {/* Si el usuario está logueado se muestran estas rutas */}
        {isAuthenticated && (
          <>
            <NavLink
              to="/collection"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Mi colección
            </NavLink>
            <NavLink
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Lista de deseados
            </NavLink>
            <NavLink
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <FaUserCircle
                className="transition-transform duration-200 hover:scale-110"
                size={28}
              />
            </NavLink>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        )}
        {/* Si el usuario NO está logueado se muestran estas rutas */}
        {!isAuthenticated && (
          <>
            {/* Para el registro, usamos loginWithRedirect con el hint de signup */}
            <button
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: { screen_hint: "signup" },
                })
              }
              className="text-white px-4 py-2 rounded-md hover:border-2 hover:border-white transition"
            >
              Registrar
            </button>

            {/* Botón de Iniciar sesión con redirección de Auth0 */}
            <button
              onClick={() => loginWithRedirect()}
              className="bg-[#ff6347] text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
            >
              Iniciar sesión
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
