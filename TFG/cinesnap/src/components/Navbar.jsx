import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Importamos Auth0

function Navbar() {
  // Obtener el usuario desde el contexto de autenticación
  // Si user existe → el usuario está logueado
  // Si user es null → el usuario no está logueado
  // Extraemos lo necesario de Auth0
  const {
    isAuthenticated,
    loginWithRedirect,
    logout
  } = useAuth0();
  // const navigate = useNavigate();

  const handleLogout = () => {
    // Auth0 maneja la redirección a la URL de origen automáticamente
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const baseLink =
    "p-5 text-white no-underline hover:text-[#ff6347] transition";

  const activeLink = "text-[#ff6347] font-bold border-b-2 border-[#ff6347]";

  return (
    <header className="fixed top-0 left-0 w-full h-[70px] bg-neutral-800 flex justify-around items-center px-10 z-50">
      <div className="text-3xl font-bold text-white">
        <NavLink to="/">DioTeca</NavLink>
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
        {isAuthenticated && (
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
              to="/wishlist"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Lista de deseados
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
