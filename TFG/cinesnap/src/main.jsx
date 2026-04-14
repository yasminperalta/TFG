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
import { Auth0Provider } from "@auth0/auth0-react";
import { SearchProvider } from "./context/search";
import { CollectionsProvider } from "./context/CollectionsProvider";

// Se selecciona el elemento con id "root" en el HTML y crea un root de React
createRoot(document.getElementById("root")).render(
  // StrictMode activa comprobaciones adicionales en desarrollo
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={
        {
          redirect_uri: window.location.origin,
          // Audience es a lo que damos acceso al usuario, en este caso, al backend de django
          audience: import.meta.env.VITE_AUTH0_AUDIENCE
        }
      }
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <SearchProvider>
        <CollectionsProvider>
          <App />
        </CollectionsProvider>
      </SearchProvider>
    </Auth0Provider>
  </StrictMode>
);
