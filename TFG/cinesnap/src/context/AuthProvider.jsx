// Import useState para manejar estado local en el componente
// Import el contexto de autenticación que creamos antes
import { useState } from "react";
import { AuthContext } from "./AuthContext";

// Componente proveedor de autenticación
// Recibe "children", que son los componentes que estarán envueltos dentro del proveedor
export default function AuthProvider({ children }) {
  // Estado local para almacenar el usuario actualmente logueado
  // Inicialmente es null, lo que indica que nadie está logueado
  const [user, setUser] = useState(null);

  // Función para iniciar sesión, recibe un email y lo guarda como objeto user
  const login = (email) => {
    setUser({ email });
  };

  // Función para cerrar sesión, reinicia el usuario a null
  const logout = () => {
    setUser(null);
  };

  // Retorna el AuthContext.Provider que envolverá a los componentes hijos
  // Pasa como "value" un objeto con el estado del usuario y las funciones de login y logout
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}  {/* Renderiza todos los componentes hijos dentro del proveedor */}
    </AuthContext.Provider>
  );
}