import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { sendRequest, directFollow, removeFriendship, removeRequest } from "../../services/friendService";
import LoginToast from "../LoginToast";

/**
 * FollowButton
 *
 * Props:
 * - userId: number         → ID de BD del usuario que se está viendo
 * - status: array          → resultado de getFriendStatus ([] si no hay relación)
 * - isTargetPublic: bool   → si el perfil es público (seguir directo) o privado (solicitud)
 * - onStatusChange: fn     → callback para recargar el estado tras una acción
 */
function FollowButton({ userId, status, isTargetPublic, onStatusChange }) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [followState, setFollowState] = useState("none");
  const [busy, setBusy] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);
  // followState: "none" | "requested" | "friend"

  useEffect(() => {
    if (!status || status.length === 0) {
      setFollowState("none");
    } else {
      setFollowState(status[0].status);
    }
  }, [status]);

  // Seguir: directo si perfil público, solicitud si perfil privado
  const handleFollow = async () => {
    if (!isAuthenticated) { setShowLoginToast(true); return; }
    setBusy(true);
    try {
      const token = await getAccessTokenSilently();
      if (isTargetPublic) {
        await directFollow(token, userId);
        setFollowState("friend");
      } else {
        await sendRequest(token, userId);
        setFollowState("requested");
      }
      onStatusChange?.();
    } catch (error) {
      console.error("Error al seguir:", error);
    } finally {
      setBusy(false);
    }
  };

  const handleCancelRequest = async () => {
    setBusy(true);
    try {
      await removeRequest(status[0]);
      setFollowState("none");
      onStatusChange?.();
    } catch (error) {
      console.error("Error al cancelar solicitud:", error);
    } finally {
      setBusy(false);
    }
  };

  const handleUnfollow = async () => {
    setBusy(true);
    try {
      const token = await getAccessTokenSilently();
      await removeFriendship(token, status[0]);
      setFollowState("none");
      onStatusChange?.();
    } catch (error) {
      console.error("Error al dejar de seguir:", error);
    } finally {
      setBusy(false);
    }
  };

  // Ya somos amigos / siguiendo
  if (followState === "friend") {
    return (
      <div className="mt-4">
        <button
          onClick={handleUnfollow}
          disabled={busy}
          className="group w-full bg-gray-500 text-white p-2 rounded-md
                     hover:bg-red-500 transition-all duration-200 disabled:opacity-50"
        >
          <span className="group-hover:hidden">{busy ? "..." : "Siguiendo"}</span>
          <span className="hidden group-hover:inline">Dejar de seguir</span>
        </button>
      </div>
    );
  }

  // Solicitud enviada (solo ocurre en perfiles privados)
  if (followState === "requested") {
    return (
      <div className="mt-4">
        <button
          onClick={handleCancelRequest}
          disabled={busy}
          className="group w-full bg-gray-500 text-white p-2 rounded-md
                     hover:bg-red-500 transition-all duration-200 disabled:opacity-50"
        >
          <span className="group-hover:hidden">{busy ? "..." : "Solicitud enviada"}</span>
          <span className="hidden group-hover:inline">Cancelar solicitud</span>
        </button>
      </div>
    );
  }

  // Sin relación
  return (
    <>
      <div className="mt-4">
        <button
          onClick={handleFollow}
          disabled={busy}
          className="w-full bg-yellow-500 text-white p-2 rounded-md
                     hover:bg-yellow-600 transition-all duration-200 disabled:opacity-50"
        >
          {busy ? "..." : isTargetPublic ? "Seguir" : "Enviar solicitud"}
        </button>
      </div>
      {showLoginToast && <LoginToast onClose={() => setShowLoginToast(false)} />}
    </>
  );
}

export default FollowButton;
