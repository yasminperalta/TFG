// Import componentes de enrutamiento de React Router

// Import componentes de la app

// Import páginas de la app
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register";
import Collection from "./pages/Collection";

// Componente principal de la aplicación
function App() {
  return (
    // BrowserRouter envuelve toda la app para habilitar enrutamiento basado en URL
   <BrowserRouter>
      <Navbar /> {/* Barra de navegación visible en todas las páginas */}
      {/* Se definen todas las rutas de la aplicación */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Ruta pública para la página de inicio */}
        <Route path="/collection"
        element={
          <ProtectedRoute>
            <Collection />
          </ProtectedRoute>
        }
        /> {/* Ruta protegida para la colección, solo accesible si el usuario está autenticado */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
        /> {/* Ruta protegida para la colección, solo accesible si el usuario está autenticado */}
      </Routes>
    </BrowserRouter>
  );
}

// Exporta el componente App para que pueda ser usado en main.jsx
export default App;