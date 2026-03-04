import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Hook personalizado para acceder fácilmente al AuthContext
//  -- Hook = función especial de React.
//            Te permite usar estado, efectos, contextos, refs, etc.
// Simplifica el uso del contexto en los componentes.
export function useAuth() {
  // useContext devuelve el valor actual del AuthContext
  // Esto incluye el usuario actual y las funciones login y logout
  return useContext(AuthContext);
}