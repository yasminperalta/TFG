// Import componentes de enrutamiento de React Router

// Import componentes de la app

// Import páginas de la app
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Friends from "./components/Friends";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Collection from "./pages/Collection";
import Wishlist from "./pages/Wishlist";
import Search from "./pages/Search";
import GlobalModal from "./components/GlobalModal";
import SharedCollection from "./pages/SharedCollection";
import { FaUserFriends } from "react-icons/fa";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

// Componente principal de la aplicación
function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0(); 
   const [openFriends, setOpenFriends] = useState(false);

   const [friends, setFriends] = useState([
     { id: 1, name: "Carlos", picture: "https://i.pravatar.cc/100?img=1" },
   ]);

   const [requests, setRequests] = useState([
     { id: 2, name: "Lucía", picture: "https://i.pravatar.cc/100?img=2" },
     { id: 3, name: "Guillermo", picture: "https://i.pravatar.cc/100?img=3" },
     { id: 4, name: "Alejandra", picture: "https://i.pravatar.cc/100?img=4" },
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
        <Route path="/shared/:id" element={<SharedCollection />} />{" "}
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
              <Profile friends={friends} requests={requests} />
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
      {isAuthenticated ? (
        <Friends
          isOpen={openFriends}
          onClose={() => setOpenFriends(false)}
          friends={friends}
          requests={requests}
          onAccept={acceptRequest}
          onReject={rejectRequest}
        />
      ) : (
        openFriends && (
          <div
            className="fixed top-0 right-0 h-full w-80 bg-neutral-900 text-white z-50 shadow-xl p-6 flex flex-col justify-center items-center"
          >
            <p className="mb-4 text-center">Debes iniciar sesión para ver tus amigos.</p>
            <button
              onClick={() => loginWithRedirect()}
              className="bg-[#ff6347] px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setOpenFriends(false)}
              className="mt-3 text-gray-400 hover:text-white transition"
            >
              Cancelar
            </button>
          </div>
        )
      )}
      <Footer />
      <GlobalModal />
    </BrowserRouter>
  );
}

// Exporta el componente App para que pueda ser usado en main.jsx
export default App;
