// Importamos el hook de Auth0 para obtener información del usuario y su estado de autenticación
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

function Profile({ friends, requests }) {
  // Extraemos información del usuario
  const { user, isAuthenticated } = useAuth0();
  const { id } = useParams();
  const [isPublic, setIsPublic] = useState(true);
  // Determinar si estamos viendo nuestro perfil
  const isMyProfile = !id || parseInt(id) === 0;

  // Si el usuario no está autenticado, mostramos un mensaje simple
  if (!isAuthenticated) return <p>No autenticado</p>;

  let displayUser;

  if (isMyProfile) {
    // Sin id → es tu perfil
    displayUser = {
      profile: "Mi perfil",
      name: user?.name || "Mi perfil",
      picture: user?.picture || "https://i.pravatar.cc/100",
      email: user?.email || "No disponible",
    };
  } else {
    const numericId = parseInt(id);

    // Buscamos primero en amigos, luego en solicitudes
    displayUser =
      friends.find((f) => f.id === numericId) ||
      requests.find((r) => r.id === numericId);

    if (displayUser) {
      // Si es un amigo
      displayUser = {
        profile: friends.some((f) => f.id === numericId)
          ? "Perfil de amigo"
          : "Solicitud pendiente",
        name: displayUser.name,
        picture: displayUser.picture || "https://i.pravatar.cc/100",
        email: displayUser.email || "No disponible",
      };
    } else {
      displayUser = {
        profile: "Perfil Desconocido",
        name: "Usuario Desconocido",
        picture: "https://i.pravatar.cc/100",
        email: "No disponible",
      };
    }
  }

  // Renderizamos la página de perfil
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232239] to-[#204989] font-sans mt-10 p-5">
      <div className="bg-white p-10 rounded-xl w-full max-w-md shadow-lg text-center">
        <h1 className="text-2xl text-gray-800 mb-7">{displayUser.profile}</h1>

        <div className="space-y-4 text-left">
          {/* Nombre del usuario */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={displayUser.name} // Muestra el nombre del usuario
              disabled // No se puede editar desde la app
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Email del usuario */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              value={displayUser.email} // Muestra el email del usuario
              disabled // No se puede editar desde la app
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Foto de perfil */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Foto
            </label>
            {displayUser.picture && (
              <img
                src={displayUser.picture} // URL de la foto del perfil
                alt="Profile"
                className="w-24 h-24 rounded-full border border-gray-300"
              />
            )}
          </div>

          {/* Toggle público/privado */}
          {/* Solo si es mi perfil */}
          {isMyProfile && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-700 font-semibold">Perfil público</span>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                isPublic
                  ? "bg-green-500 justify-end"
                  : "bg-gray-300 justify-start"
              }`}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
            </button>
          </div>
          )}

          {/* Estado actual */}
          <p className="text-blue-500 mt-2 text-sm">
            Perfil actualmente:{" "}
            <span className="font-semibold">
              {isPublic ? "Público" : "Privado"}
            </span>
          </p>
        </div>

        {/* Mensaje informativo para cambiar datos sensibles */}
        <p className="text-gray-500 mt-4 text-sm">
          Para cambiar email, contraseña o nombre, usa la plataforma de Auth0.
        </p>
      </div>
    </div>
  );
}

export default Profile;
