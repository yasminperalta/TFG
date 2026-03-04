import { Link } from "react-router-dom";

function Navbar() 
{ return (
<header className="navbar"> 
  <div className="logo"><Link to="/">AGREGAR LOGO Y TITULO</Link> </div> 
  <nav> <Link to="/">Inicio</Link> 
  <Link to="/collection">Mi colección</Link> 
  <Link to="/login">Iniciar sesión</Link> 
  <Link to="/profile">Perfil (cuando ya se haya iniciado sesión)</Link> 
  </nav> 
  </header> );
}

export default Navbar;