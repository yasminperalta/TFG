// Importa createContext desde React, que permite
// crear un contexto para compartir datos globalmente
// Permite que cualquier componente dentro del AuthProvider
// acceda al estado de autenticación sin necesidad de pasar props manualmente.
import { createContext } from "react";

// Crea un contexto de autenticación y lo exporta
// El valor inicial se establece en null (no hay usuario logueado por defecto)
// Será usado en el proveedor (AuthProvider) y también por componentes que
// necesiten acceder al usuario o funciones de login/logout.
export const AuthContext = createContext(null);