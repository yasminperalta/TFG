import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaUserFriends } from "react-icons/fa";

// Componentes
import Navbar from "./components/Navbar";
import Friends from "./components/Friends";
import Footer from "./components/Footer";
import GlobalModal from "./components/GlobalModal";
import { AppRouter } from "./routes/AppRouter";
import Scroll from "./components/Scroll";

function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [openFriends, setOpenFriends] = useState(false);

  // --- Lógica de Amigos ---
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
    <BrowserRouter>
      <div className="relative min-h-screen m-0 font-sans text-white">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
        {/* Overlay negro para oscurecer */}
        <div className="absolute inset-0 bg-black opacity-85"></div>

        <Navbar openFriends={openFriends} />

        {/* El router */}
        <div className="relative mx-auto px-8 py-8">
          <AppRouter friends={friends} requests={requests} />
        </div>

        {/* --- UI Global (Sidebars, Modales, Botones Flotantes) --- */}
        {openFriends && (
          <div
            onClick={() => setOpenFriends(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
          />
        )}

        <button
          onClick={() => setOpenFriends(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#E50914] text-white p-4 rounded-full shadow-lg hover:bg-red-700 hover:scale-110 transition-all duration-300"
        >
          <FaUserFriends size={22} />
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
            <div className="fixed top-0 right-0 h-full w-80 bg-neutral-900 text-white z-50 shadow-xl p-6 flex flex-col justify-center items-center">
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
      </div>

      <Footer />
      {/* Botón Volver arriba */}
      <Scroll />
      <GlobalModal />
    </BrowserRouter>
  );
}

export default App;