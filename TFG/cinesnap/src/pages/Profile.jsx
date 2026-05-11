import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileView from "../components/Profile//ProfileView";
import { getUser } from "../services/userService";

function Profile({ friends, requests }) {
  const { user, isAuthenticated } = useAuth0();
  const [displayUser, setDisplayUser] = useState({});

  // Extraemos el parámetro id de la URL
  const { id } = useParams();

  // Estado local para controlar si nuestro propio perfil es público o privado
  const [isPublic, setIsPublic] = useState(true);

  // Determina si estamos viendo nuestro propio perfil
  const isMyProfile = !id || parseInt(id, 10) === 0;

  // Convertimos el id de URL a número
  const numericId = parseInt(id, 10);

  if (!isAuthenticated) return <p>No autenticado</p>;

  const loadUser = async (user_id) => {
    try {
      const user = await getUser(user_id);
      setDisplayUser(user);
    } catch (error) {
      console.error("Error recuperando usuario:", error);
    }
  };

  useEffect(() => {
    if (isMyProfile) {
      // Caso: estamos viendo nuestro propio perfil
      setDisplayUser({
        profile: "Mi perfil",
        username: user?.name || "Mi perfil", // Nombre del usuario de Auth0 o valor por defecto
        picture_url: user?.picture || "https://i.pravatar.cc/100", // Foto de perfil o avatar genérico
        isPublic, // Estado de público/privado del perfil
      });
    } else {
      // Caso: perfil de otra persona
      loadUser(id);
    }
  }, [id]);

  return (
    <ProfileView
      user_id={id}
      displayUser={displayUser} // Datos a mostrar
      isMyProfile={isMyProfile} // Para mostrar toggle público/privado
      isPublic={isPublic} // Estado de visibilidad
      setIsPublic={setIsPublic} // Función para cambiar visibilidad
    />
  );
}

export default Profile;
