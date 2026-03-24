// Import componentes de enrutamiento de React Router

// Import componentes de la app

// Import páginas de la app
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Collection from "./pages/Collection";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import Friends from "./components/Friends";
import { FaUserFriends } from "react-icons/fa";
import { useState } from "react";

// Componente principal de la aplicación
function App() {
   const [openFriends, setOpenFriends] = useState(false);

   const [friends, setFriends] = useState([
     { id: 1, name: "Carlos", picture: "https://i.pravatar.cc/100?img=1" },
   ]);

   const [requests, setRequests] = useState([
     { id: 2, name: "Lucía", picture: "https://i.pravatar.cc/100?img=2" },
   ]);

   const acceptRequest = (id) => {
     const user = requests.find((r) => r.id === id);
     setFriends([...friends, user]);
     setRequests(requests.filter((r) => r.id !== id));
   };

   const rejectRequest = (id) => {
     setRequests(requests.filter((r) => r.id !== id));
   };

  return (
    // BrowserRouter envuelve toda la app para habilitar enrutamiento basado en URL
    <BrowserRouter>
      {/* Navbar recibe el estado para transparencia */}
      <Navbar openFriends={openFriends} />
      {/* Barra de navegación visible en todas las páginas */}
      {/* Se definen todas las rutas de la aplicación */}
      <Routes>
        <Route path="/" element={<Home />} />{" "}
        {/* Ruta pública para la página de inicio */}
        <Route path="/search" element={<Search />} />{" "}
        <Route
          path="/collection"
          element={
            <ProtectedRoute>
              <Collection />
            </ProtectedRoute>
          }
        />{" "}
        {/* Ruta protegida para la colección, solo accesible si el usuario está autenticado */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />{" "}
        {/* Ruta protegida para wishlist, solo accesible si el usuario está autenticado */}
        {/* Perfil propio o de amigos */}
        <Route
          path="/profile/:id?"
          element={
            <ProtectedRoute>
              <Profile friends={friends} />
            </ProtectedRoute>
          }
        />
        {/* Ruta protegida para el perfil, solo accesible si el usuario está autenticado */}
      </Routes>
      {/* Overlay global cuando se abre Friends */}
      {openFriends && (
        <div
          onClick={() => setOpenFriends(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        />
      )}
      {/* Drawer de amigos */}
      <button
        onClick={() => setOpenFriends(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#E50914]
        text-white p-4 rounded-full shadow-lg
        hover:bg-red-700 hover:scale-110 transition-all duration-300"
      >
        <FaUserFriends size={22} />

        {/* Badge */}
        {requests.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {requests.length}
          </span>
        )}
      </button>
      <Friends
        isOpen={openFriends}
        onClose={() => setOpenFriends(false)}
        friends={friends}
        requests={requests}
        onAccept={acceptRequest}
        onReject={rejectRequest}
      />
    </BrowserRouter>
  );
}

// Exporta el componente App para que pueda ser usado en main.jsx
export default App;
