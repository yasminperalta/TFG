// Import StrictMode de React, que ayuda a
// detectar problemas potenciales en la aplicación durante el desarrollo

// Import createRoot para renderizar la aplicación en el DOM

// Import los estilos globales de la aplicación

// Import el componente principal de la aplicación

// Import el proveedor de contexto de autenticación
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider";

// Se selecciona el elemento con id "root" en el HTML y crea un root de React
createRoot(document.getElementById("root")).render(
  // StrictMode activa comprobaciones adicionales en desarrollo
  <StrictMode>
    {/* AuthProvider envuelve toda la
     app para proporcionar el contexto de autenticación a cualquier componente */}
    <AuthProvider>
      {/* Se renderiza el componente principal de la app */}
      <App />
    </AuthProvider>
  </StrictMode>
);