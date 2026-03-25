import { useState } from "react";

/**
 * FollowButton
 * Componente que maneja el estado de seguimiento de un usuario
 * - isPublic: boolean -> si el perfil es público
 * - isFriend: boolean -> si ya seguimos al usuario
 * - targetUserId: number -> ID del usuario al que aplican las acciones
 */

function FollowButton({ isPublic, isFriend }) {
  const [followState, setFollowState] = useState("none");
  // "none" | "following" | "requested"

  // Inicializamos el estado desde localStorage para simular persistencia
  const handleFollow = () => setFollowState("following");
  const handleUnfollow = () => setFollowState("none");
  const handleRequest = () => setFollowState("requested");
  const handleCancelRequest = () => setFollowState("none");

  // SIGUIENDO
  if (isFriend || followState === "following") {
    return (
      <div className="mt-4">
        <button
          onClick={handleUnfollow}
          className="group w-full bg-gray-400 text-white p-2 rounded-md 
                     hover:bg-red-500 transition-all duration-200"
        >
          <span className="group-hover:hidden">Siguiendo</span>
          <span className="hidden group-hover:inline">Dejar de seguir</span>
        </button>
      </div>
    );
  }

  // SOLICITUD ENVIADA
  if (followState === "requested") {
    return (
      <div className="mt-4">
        <button
          onClick={handleCancelRequest}
          className="group w-full bg-gray-400 text-white p-2 rounded-md 
                     hover:bg-red-500 transition-all duration-200"
        >
          <span className="group-hover:hidden">Solicitud enviada</span>
          <span className="hidden group-hover:inline">Cancelar solicitud</span>
        </button>
      </div>
    );
  }

  // ESTADO INICIAL
  return (
    <div className="mt-4">
      {isPublic ? (
        <button
          onClick={handleFollow}
          className="w-full bg-green-500 text-white p-2 rounded-md 
                     hover:bg-green-600 transition-all duration-200"
        >
          Seguir
        </button>
      ) : (
        <button
          onClick={handleRequest}
          className="w-full bg-yellow-500 text-white p-2 rounded-md 
                     hover:bg-yellow-600 transition-all duration-200"
        >
          Enviar solicitud
        </button>
      )}
    </div>
  );
}

export default FollowButton;
