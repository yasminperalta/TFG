import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaUserCheck, FaUserTimes, FaUserMinus } from "react-icons/fa";
import { getPublicUsers } from "../services/userService";
import { ThreeDot } from "react-loading-indicators";
import {
  acceptRequest,
  getIncomingFriendStatus,
  removeRequest,
  removeFriendship,
  sendRequest,
  directFollow,
} from "../services/friendService";
import { useAuth0 } from "@auth0/auth0-react";

function Friends({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState([]);

  const { user, getAccessTokenSilently } = useAuth0();

  const goToFriendProfile = (id) => {
    setQuery("");
    onClose();
    navigate(`/profile/${id}`);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleChange = (e) => setQuery(e.target.value);

  const normalizeText = (text) =>
    text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // ─── Datos derivados ──────────────────────────────────────────────────────────

  // El username en la BD es user.name de Auth0 (ver authService.js)
  const myName = user?.name ?? "";

  // Solicitudes ENTRANTES: otros me enviaron una solicitud (su registro tiene user_name ≠ yo)
  const incomingRequests = friendStatus
    .filter((item) => item.user_name !== myName && item.status === "requested")
    .map((item) => users.find((u) => u.id === item.user))
    .filter((u) => u && normalizeText(u.username).includes(normalizeText(query)));

  // Amigos confirmados: deduplicados (hay dos registros por amistad mutua)
  const confirmedFriends = (() => {
    const seen = new Set();
    const result = [];
    for (const item of friendStatus.filter((i) => i.status === "friend")) {
      const otherId = item.user_name === myName ? item.friend : item.user;
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const u = users.find((u) => u.id === otherId);
        if (u && normalizeText(u.username).includes(normalizeText(query))) {
          result.push(u);
        }
      }
    }
    return result;
  })();

  // Sets de IDs para clasificación rápida
  const friendIds = new Set(confirmedFriends.map((u) => u.id));
  const incomingIds = new Set(incomingRequests.filter(Boolean).map((u) => u.id));

  // Solicitudes que YO envié y están pendientes
  const getMySentReq = (userId) =>
    friendStatus.find(
      (item) =>
        item.friend === userId &&
        item.user_name === myName &&
        item.status === "requested"
    );

  // Usuarios para la sección "Usuarios": excluye amigos e incoming (ya aparecen arriba)
  const filteredUsers = users.filter(
    (u) =>
      normalizeText(u.username).includes(normalizeText(query)) &&
      !friendIds.has(u.id) &&
      !incomingIds.has(u.id)
  );

  // ─── Carga de datos ───────────────────────────────────────────────────────────

  const loadUsers = async () => {
    try {
      const publicUsers = await getPublicUsers();
      const filtered = publicUsers.filter(
        (u) => u.username.trim().toLowerCase() !== myName.trim().toLowerCase()
      );
      setUsers(filtered);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshFriendStatus = async () => {
    try {
      const token = await getAccessTokenSilently();
      const status = await getIncomingFriendStatus(token);
      setFriendStatus(status);
    } catch (error) {
      console.error("Error recuperando estado de amistad:", error);
    }
  };

  useEffect(() => {
    loadUsers();
    refreshFriendStatus();
  }, []);

  // Refresca el estado de amistad cada vez que se abre el drawer
  useEffect(() => {
    if (isOpen) refreshFriendStatus();
  }, [isOpen]);

  // ─── Acciones ─────────────────────────────────────────────────────────────────

  const acceptFriendRequest = async (req) => {
    try {
      const token = await getAccessTokenSilently();
      await acceptRequest(token, req);
      refreshFriendStatus();
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
    }
  };

  const rejectFriendRequest = async (req) => {
    try {
      await removeRequest(req);
      refreshFriendStatus();
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    }
  };

  const sendFriendRequest = async (targetUser) => {
    try {
      const token = await getAccessTokenSilently();
      if (targetUser.is_public) {
        await directFollow(token, targetUser.id);
      } else {
        await sendRequest(token, targetUser.id);
      }
      refreshFriendStatus();
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
    }
  };

  const cancelSentRequest = async (req) => {
    try {
      await removeRequest(req);
      refreshFriendStatus();
    } catch (error) {
      console.error("Error al cancelar solicitud:", error);
    }
  };

  const removeFriend = async (friendUser) => {
    try {
      const token = await getAccessTokenSilently();
      // Buscar todos los registros de amistad con este usuario
      const recordsToDelete = friendStatus.filter(
        (item) =>
          (item.user === friendUser.id || item.friend === friendUser.id) &&
          item.status === "friend"
      );
      await Promise.all(recordsToDelete.map((req) => removeRequest(req)));
      refreshFriendStatus();
    } catch (error) {
      console.error("Error al eliminar amigo:", error);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-neutral-900 text-white z-50 shadow-xl
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Buscador */}
        <div className="flex items-center bg-neutral-700 rounded-md px-3 py-1 gap-2 m-4">
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
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none text-white placeholder-gray-400 w-40 md:w-56"
            value={query}
            onChange={handleChange}
          />
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

          {/* ── Solicitudes entrantes ── */}
          {incomingRequests.length > 0 && (
            <section className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Solicitudes ({incomingRequests.length})
              </h3>
              {incomingRequests.map((u) => {
                const req = friendStatus.find((r) => r.user === u.id && r.status === "requested");
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between mb-3 bg-neutral-800 p-2 rounded"
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => goToFriendProfile(u.id)}
                    >
                      <img
                        src={u.picture_url || "/Gilda.jpg"}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={u.username}
                      />
                      <span className="text-sm">{u.username}</span>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={() => acceptFriendRequest(req)}
                        className="bg-green-600 p-1.5 rounded hover:bg-green-700 transition"
                        title="Aceptar"
                      >
                        <FaUserCheck size={14} />
                      </button>
                      <button
                        onClick={() => rejectFriendRequest(req)}
                        className="bg-red-600 p-1.5 rounded hover:bg-red-700 transition"
                        title="Rechazar"
                      >
                        <FaUserTimes size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* ── Amigos confirmados ── */}
          {confirmedFriends.length > 0 && (
            <section className="mb-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Amigos ({confirmedFriends.length})
              </h3>
              {confirmedFriends.map((u) => (
                <div
                  key={u.id}
                  className="group flex items-center justify-between mb-3 bg-neutral-800 p-2 rounded"
                >
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => goToFriendProfile(u.id)}
                  >
                    <img
                      src={u.picture_url || "/Gilda.jpg"}
                      className="w-10 h-10 rounded-full object-cover"
                      alt={u.username}
                    />
                    <span className="text-sm">{u.username}</span>
                  </div>
                  <button
                    onClick={() => removeFriend(u)}
                    className="ml-auto opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 p-1.5 rounded transition"
                    title="Eliminar amigo"
                  >
                    <FaUserMinus size={14} />
                  </button>
                </div>
              ))}
            </section>
          )}

          {/* ── Otros usuarios ── */}
          {loading ? (
            <div className="flex justify-center mt-6">
              <ThreeDot color={["#dc2626"]} />
            </div>
          ) : (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Usuarios
              </h3>
              {filteredUsers.length === 0 && (
                <p className="text-gray-500 text-sm">No hay usuarios que mostrar.</p>
              )}
              {filteredUsers.map((u) => {
                const myReq = getMySentReq(u.id);
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between mb-3 bg-neutral-800 p-2 rounded cursor-pointer"
                    onClick={() => goToFriendProfile(u.id)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={u.picture_url || "/Gilda.jpg"}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={u.username}
                      />
                      <span className="text-sm">{u.username}</span>
                    </div>

                    <div className="flex gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                      {myReq ? (
                        // Solicitud enviada por mí, pendiente de respuesta
                        <button
                          onClick={() => cancelSentRequest(myReq)}
                          className="text-xs bg-neutral-600 hover:bg-red-700 text-gray-300 hover:text-white px-2 py-1 rounded transition"
                          title="Cancelar solicitud"
                        >
                          Pendiente ✕
                        </button>
                      ) : (
                        // Sin relación: seguir directo (público) o solicitud (privado)
                        <button
                          onClick={() => sendFriendRequest(u)}
                          className="bg-green-600 p-1.5 rounded hover:bg-green-700 transition"
                          title={u.is_public ? "Seguir" : "Enviar solicitud"}
                        >
                          <FaUserCheck size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export default Friends;
