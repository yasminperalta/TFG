import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
  // Obtener el usuario desde el contexto de autenticación
  // Si user existe → el usuario está logueado
  // Si user es null → el usuario no está logueado
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Cierra sesión en el contexto
    navigate("/login"); // Redirige al login
  };

  const baseLink =
    "p-5 text-white no-underline hover:text-[#ff6347] transition";

  const activeLink = "text-[#ff6347] font-bold border-b-2 border-[#ff6347]";

  return (
    <header className="fixed top-0 left-0 w-full h-[70px] bg-neutral-800 flex justify-around items-center px-10">
      <div className="text-xl font-bold text-white">
        <NavLink to="/">AGREGAR LOGO Y TITULO</NavLink>
      </div>
      <nav className="flex items-center gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : ""}`
          }
        >
          Inicio
        </NavLink>
        {/* Si el usuario está logueado se muestran estas rutas */}
        {user && (
          <>
            <NavLink
              to="/collection"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Mi colección
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Perfil
            </NavLink>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        )}
        {/* Si el usuario NOestá logueado se muestran estas rutas */}
        {!user && (
          <>
            <NavLink
              to="/register"
              className="text-white px-4 py-2 rounded-md hover:border-2 hover:border-white transition"
            >
              Registrar
            </NavLink>
            <NavLink
              to="/login"
              className="bg-[#ff6347] text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition"
            >
              Iniciar sesión
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
