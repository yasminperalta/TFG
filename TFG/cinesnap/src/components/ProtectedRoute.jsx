import { useAuth0 } from "@auth0/auth0-react";

// Componente que protege rutas, solo deja acceder si el usuario está logueado
export default function ProtectedRoute({ children }) {
  // Extrae el usuario actual desde el contexto
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // Mientras carga Auth0
  if (isLoading) return <p>Cargando...</p>;

  // Si no está logueado
  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname },
    });
    return null;
  }

  // Si el usuario está logueado, renderiza los componentes hijos
  // <> </> es un fragmento que asegura que devuelve un solo nodo
  return <>{children}</>;
}
