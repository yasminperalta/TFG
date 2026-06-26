import { BrowserRouter } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaUserFriends } from "react-icons/fa";

// Componentes
import Navbar from "./components/Navbar";
import Friends from "./components/Friends";
import Footer from "./components/Footer";
import GlobalModal from "./components/GlobalModal";
import { AppRouter } from "./routes/AppRouter";
import Scroll from "./components/Scroll";
import { getIncomingFriendStatus } from "./services/friendService";

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently, user } = useAuth0();
  const [openFriends, setOpenFriends] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Cuenta solicitudes entrantes pendientes para mostrar la badge
  const refreshPendingCount = useCallback(async () => {
    if (!isAuthenticated) { setPendingCount(0); return; }
    try {
      const token = await getAccessTokenSilently();
      const all = await getIncomingFriendStatus(token);
      const myName = user?.name ?? "";
      const incoming = all.filter(r => r.status === "requested" && r.user_name !== myName);
      setPendingCount(incoming.length);
    } catch {
      // Si falla silenciosamente no bloqueamos la app
    }
  }, [isAuthenticated, user]);

  // Carga inicial y polling cada 60 s
  useEffect(() => {
    refreshPendingCount();
    const interval = setInterval(refreshPendingCount, 60_000);
    return () => clearInterval(interval);
  }, [refreshPendingCount]);

  // Mientras Auth0 verifica la sesión, no mostramos nada para evitar el flash de "desconectado"
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="relative min-h-screen m-0 font-sans text-white overflow-x-hidden bg-[#111]">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>
        {/* Overlay negro para oscurecer */}
        <div className="absolute inset-0 bg-black/90"></div>

        <Navbar openFriends={openFriends} />

        {/* El router */}
        <div className="relative mx-auto px-4 sm:px-8 py-8">
          <AppRouter />
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
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {pendingCount > 9 ? "9+" : pendingCount}
            </span>
          )}
        </button>

        {isAuthenticated ? (
          <Friends
            isOpen={openFriends}
            onClose={() => { setOpenFriends(false); refreshPendingCount(); }}
          />
        ) : (
          openFriends && (
            <div className="fixed top-0 right-0 h-full w-80 bg-neutral-900 text-white z-50 shadow-xl p-6 flex flex-col justify-center items-center">
              <p className="mb-4 text-center">
                Debes iniciar sesión para ver tus amigos.
              </p>
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