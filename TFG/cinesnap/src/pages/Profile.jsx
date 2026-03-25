import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/Profile/ProfileCard";
import FollowButton from "../components/Profile/FollowButton";

function Profile({ friends, requests }) {
  const { user, isAuthenticated } = useAuth0();
  // Extraemos el parámetro id de la URL
  const { id } = useParams();

  // Estado local para controlar si nuestro propio perfil es público o privado
  const [isPublic, setIsPublic] = useState(true);

  // Determina si estamos viendo nuestro propio perfil
  const isMyProfile = !id || parseInt(id) === 0;

  // Convertimos el id de URL a número
  const numericId = parseInt(id);

  // Verificamos si el perfil que estamos viendo es amigo o solicitud pendiente
  const isFriend = friends.some((f) => f.id === numericId); // true si es amigo
  const isRequested = requests.some((r) => r.id === numericId); // true si hay solicitud pendiente
  const isNotFriend = !isFriend && !isRequested && !isMyProfile; // true si es un usuario nuevo

  if (!isAuthenticated) return <p>No autenticado</p>;

  let displayUser; // Objeto que contendrá la información que se va a mostrar en el perfil

  if (isMyProfile) {
    // Caso: estamos viendo nuestro propio perfil
    displayUser = {
      profile: "Mi perfil",
      name: user?.name || "Mi perfil", // Nombre del usuario de Auth0 o valor por defecto
      picture: user?.picture || "https://i.pravatar.cc/100", // Foto de perfil o avatar genérico
      email: user?.email || "No disponible", // Email o valor por defecto
      isPublic, // Estado de público/privado del perfil
    };
  } else {
    // Caso: perfil de otra persona
    const foundUser =
      friends.find((f) => f.id === numericId) || // Buscamos primero en amigos
      requests.find((r) => r.id === numericId); // Luego en solicitudes pendientes

    if (foundUser) {
      // Usuario encontrado (amigo o solicitud)
      displayUser = {
        profile: isFriend ? "Perfil de amigo" : "Solicitud pendiente", // Título del perfil
        name: foundUser.name, // Nombre del usuario
        picture: foundUser.picture || "https://i.pravatar.cc/100", // Foto de perfil
        email: foundUser.email || "No disponible", // Email
        isPublic: foundUser.isPublic ?? false, // Si es público o privado
      };
    } else {
      // Usuario desconocido (no amigo, no solicitud)
      displayUser = {
        profile: "Perfil Desconocido",
        name: "Usuario Desconocido",
        picture: "https://i.pravatar.cc/100",
        email: "No disponible",
        isPublic: true, // Por defecto, perfil público
      };
    }
  }

    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232239] to-[#204989] font-sans mt-10 p-5">
      <div className="bg-white p-10 rounded-xl w-full max-w-md shadow-lg text-center">
        {/* Tarjeta de perfil */}
        <ProfileCard
          displayUser={displayUser}   // Datos a mostrar
          isMyProfile={isMyProfile}   // Para mostrar toggle público/privado
          isPublic={isPublic}         // Estado de visibilidad
          setIsPublic={setIsPublic}   // Función para cambiar visibilidad
        />

        {/* Botón de seguir o enviar solicitud solo si no es mi perfil */}
        {!isMyProfile && (
          <FollowButton
            isPublic={displayUser.isPublic}   // Si el perfil es público
            isFriend={isFriend}               // Si ya es amigo
            isRequested={isRequested}         // Si hay solicitud pendiente
            isNotFriend={isNotFriend}         // Si es usuario nuevo
          />
        )}

        {/* Mensaje informativo sobre Auth0 */}
        <p className="text-gray-500 mt-4 text-sm">
          Para cambiar email, contraseña o nombre, usa Auth0.
        </p>
      </div>
    </div>
  );
}

export default Profile;
