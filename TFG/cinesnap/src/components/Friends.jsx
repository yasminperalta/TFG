import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaUserCheck, FaUserTimes } from "react-icons/fa";

/**
 * Friends
 * Drawer lateral que muestra amigos y solicitudes de amistad
 *
 * Props:
 * - isOpen: boolean -> si el drawer está abierto
 * - onClose: función -> para cerrar el drawer
 * - friends: array -> lista de amigos
 * - requests: array -> lista de solicitudes pendientes
 * - onAccept: función -> acepta solicitud de amistad
 * - onReject: función -> rechaza solicitud de amistad
 */
function Friends({ isOpen, onClose, friends, requests, onAccept, onReject }) {
  const navigate = useNavigate(); // Para navegar a la página de perfil
  const [query, setQuery] = useState(""); // Estado local para búsqueda

  /**
   * Función que navega al perfil de un amigo
   * Limpia la búsqueda y cierra el drawer antes de redirigir
   */
  const goToFriendProfile = (id) => {
    setQuery(""); // Limpiar búsqueda
    onClose(); // Cerrar drawer
    navigate(`/profile/${id}`); // Redirigir al perfil del amigo
  };

  /**
   * Bloquear scroll del body cuando el drawer está abierto
   * Se revierte cuando se cierra
   */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  // Actualiza el query cuando el usuario escribe en el input
  const handleChange = (e) => setQuery(e.target.value);

  /**
   * Normaliza texto para búsquedas:
   * - Elimina acentos
   * - Convierte a minúsculas
   */
  const normalizeText = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // Filtra amigos y solicitudes según el query
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
        <div className="flex items-center bg-neutral-700 rounded-md px-3 py-1 gap-2 m-4">
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

          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar amigos..."
            className="bg-transparent outline-none text-white placeholder-gray-400 w-40 md:w-56"
            value={query}
            onChange={handleChange}
          />

          {/* Botón para limpiar búsqueda */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-white transition"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Header del drawer */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-700">
          <h2 className="text-xl font-semibold">Amigos</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Contenido del drawer: lista de solicitudes y amigos */}
        <div className="p-4 overflow-y-auto h-full pb-20">
          {/* Solicitudes pendientes */}
          {filteredRequests.length > 0 && (
            <>
              <h3 className="mb-3 text-lg">Solicitudes</h3>
              {filteredRequests.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between mb-3 bg-neutral-800 p-2 rounded"
                >
                  {/* Info del usuario (clic para ir al perfil) */}
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => goToFriendProfile(user.id)}
                  >
                    <img
                      src={user.picture}
                      className="w-10 h-10 rounded-full"
                      alt={user.name}
                    />
                    <span>{user.name}</span>
                  </div>

                  {/* Botones aceptar/rechazar solicitud */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAccept(user.id)}
                      className="bg-green-600 p-1 rounded hover:bg-green-700 transition"
                    >
                      <FaUserCheck />
                    </button>
                    <button
                      onClick={() => onReject(user.id)}
                      className="bg-red-600 p-1 rounded hover:bg-red-700 transition"
                    >
                      <FaUserTimes />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Lista de amigos */}
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
                className="flex items-center gap-3 mb-3 bg-neutral-800 p-2 rounded cursor-pointer hover:bg-neutral-700 transition"
                onClick={() => goToFriendProfile(friend.id)}
              >
                <img
                  src={friend.picture}
                  className="w-10 h-10 rounded-full"
                  alt={friend.name}
                />
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
