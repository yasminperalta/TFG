import ProfileCard from "./ProfileCard";
import FollowButton from "./FollowButton";

function ProfileView({
  displayUser,
  isMyProfile,
  isPublic,
  setIsPublic,
  isFriend,
  isRequested,
  isNotFriend,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232239] to-[#204989] font-sans mt-10 p-5">
      <div className="bg-white p-10 rounded-xl w-full max-w-md shadow-lg text-center">
        {/* Tarjeta de perfil */}
        <ProfileCard
          displayUser={displayUser} // Datos a mostrar
          isMyProfile={isMyProfile} // Para mostrar toggle público/privado
          isPublic={isPublic} // Estado de visibilidad
          setIsPublic={setIsPublic} // Función para cambiar visibilidad
        />

        {/* Botón de seguir o enviar solicitud solo si no es mi perfil */}
        {!isMyProfile && (
          <FollowButton
            isPublic={displayUser.isPublic} // Si el perfil es público
            isFriend={isFriend} // Si ya es amigo
            isRequested={isRequested} // Si hay solicitud pendiente
            isNotFriend={isNotFriend} // Si es usuario nuevo
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

export default ProfileView;
