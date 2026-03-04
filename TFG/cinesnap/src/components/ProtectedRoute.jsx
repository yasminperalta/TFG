// Import Navigate de React Router para redirigir al usuario
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// Componente que protege rutas, solo deja acceder si el usuario está logueado
export default function ProtectedRoute({ children }) {
  // Extrae el usuario actual desde el contexto
  const { user } = useAuth();

  // Si no hay usuario logueado, redirige automáticamente a la página de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está logueado, renderiza los componentes hijos
  // <> </> es un fragmento que asegura que devuelve un solo nodo
  return <>{children}</>;
}