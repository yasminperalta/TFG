import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./navbar.css";

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

  return (
    <header className="navbar">
      <div className="logo">
        <NavLink to="/">AGREGAR LOGO Y TITULO</NavLink>
      </div>
      <nav>
        <NavLink to="/" className={"nav-links"}>
          Inicio
        </NavLink>
        {/* Si el usuario está logueado se muestran estas rutas */}
        {user && (
          <>
            <NavLink to="/collection" className={"nav-links"}>
              Mi colección
            </NavLink>
            <NavLink to="/profile" className={"nav-links"}>
              Perfil
            </NavLink>

            <button className="logout-btn logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        )}
        {/* Si el usuario NOestá logueado se muestran estas rutas */}
        {!user && (
          <>
            <NavLink to="/register" id="registrar">
              Registrar
            </NavLink>
            <NavLink to="/login" id="iniciar_sesion">
              Iniciar sesión
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
