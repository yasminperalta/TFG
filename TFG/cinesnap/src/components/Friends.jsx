import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaUserCheck, FaUserTimes } from "react-icons/fa";

function Friends({ isOpen, onClose, friends, requests, onAccept, onReject }) {
    const navigate = useNavigate();

    const goToFriendProfile = (id) => {
      onClose(); // cerrar drawer
      navigate(`/profile/${id}`);
    };

  // Bloquear scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* Drawer lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-neutral-900 text-white z-50 shadow-xl
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-700">
          <h2 className="text-xl font-semibold">Amigos</h2>
          <button onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full pb-20">
          {/* Solicitudes */}
          {requests.length > 0 && (
            <>
              <h3 className="mb-3 text-lg">Solicitudes</h3>
              {requests.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between mb-3 bg-neutral-800 p-2 rounded"
                >
                  <div className="flex items-center gap-2"
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
          {friends.length === 0 ? (
            <p className="text-gray-400">No tienes amigos aún</p>
          ) : (
            friends.map((friend) => (
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
