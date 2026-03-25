import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { useState } from "react";

function Friends({ isOpen, onClose, friends, requests, onAccept, onReject }) {
    const navigate = useNavigate();
//    const users = [...friends, ...requests]; // Combina amigos y solicitudes para búsqueda. 
    // Deberíamos mejorar esto para buscar en la base de datos y no solo en los amigos actuales y solicitudes.
    const [query, setQuery] = useState("");

    const goToFriendProfile = (id) => {
      setQuery(""); // Limpiar búsqueda al ir al perfil
      onClose(); // cerrar drawer
      navigate(`/profile/${id}`);
    };

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const normalizeText = (text) =>
    text
      .normalize("NFD") // Descompone letras con acentos
      .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
      .toLowerCase();

  const filteredFriends = friends.filter((user) =>
    normalizeText(user.name).includes(normalizeText(query)),
  );

  const filteredRequests = requests.filter((user) =>
    normalizeText(user.name).includes(normalizeText(query)),
  );

  return (
    <>
      {/* Drawer lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-neutral-900 text-white z-50 shadow-xl
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Buscador */}
        <div className="flex items-center bg-neutral-700 rounded-md px-3 py-1 gap-2">
          {/* Icono lupa */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m1.85-5.4a7.25 7.25 0 1 1-14.5 0 7.25 7.25 0 0 1 14.5 0Z"
            />
          </svg>

          {/* Input */}
          <input
            type="text"
            placeholder="Buscar amigos..."
            className="bg-transparent outline-none text-white placeholder-gray-400 w-40 md:w-56"
            value={query}
            onChange={handleChange}
          />
          {/* Botón limpiar */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-white transition"
            >
              <FaTimes />
            </button>
          )}
        </div>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-700">
          <h2 className="text-xl font-semibold">Amigos</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full pb-20">
          {/* Solicitudes */}
          {filteredRequests.length > 0 && (
            <>
              <h3 className="mb-3 text-lg">Solicitudes</h3>
              {filteredRequests.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between mb-3 bg-neutral-800 p-2 rounded"
                >
                  <div
                    className="flex items-center gap-2"
                    onClick={() => goToFriendProfile(user.id)}
                  >
                    <img
                      src={user.picture}
                      className="w-10 h-10 rounded-full"
                    />
                    <span>{user.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAccept(user.id)}
                      className="bg-green-600 p-1 rounded"
                    >
                      <FaUserCheck />
                    </button>
                    <button
                      onClick={() => onReject(user.id)}
                      className="bg-red-600 p-1 rounded"
                    >
                      <FaUserTimes />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Amigos */}
          <h3 className="mt-6 mb-3 text-lg">Tus amigos</h3>
          {filteredFriends.length === 0 ? (
            query ? (
              <p className="text-gray-400">No se encontraron amigos</p>
            ) : (
              <p className="text-gray-400">No tienes amigos aún</p>
            )
          ) : (
            filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 mb-3 bg-neutral-800 p-2 rounded"
                onClick={() => goToFriendProfile(friend.id)}
              >
                <img src={friend.picture} className="w-10 h-10 rounded-full" />
                <span>{friend.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Friends;
