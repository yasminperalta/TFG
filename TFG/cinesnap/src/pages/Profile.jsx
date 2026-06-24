import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileView from "../components/Profile//ProfileView";
import { getUser, getMyProfile, updateMyProfile } from "../services/userService";

function Profile() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [displayUser, setDisplayUser] = useState({});
  const [isPublic, setIsPublicState] = useState(true);

  const { id } = useParams();
  const isMyProfile = !id || parseInt(id, 10) === 0;

  if (!isAuthenticated) return <p>No autenticado</p>;

  // Carga el perfil de otro usuario
  const loadUser = async (user_id) => {
    try {
      const data = await getUser(user_id);
      setDisplayUser(data);
    } catch (error) {
      console.error("Error recuperando usuario:", error);
    }
  };

  // Carga el perfil propio desde la BD (para obtener is_public real)
  const loadMyProfile = async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getMyProfile(token);
      setIsPublicState(data.is_public);
      setDisplayUser({
        username: user?.name || data.username,
        picture_url: user?.picture || data.picture_url,
        is_public: data.is_public,
      });
    } catch (error) {
      // Fallback con datos de Auth0 si falla la BD
      setDisplayUser({
        username: user?.name || "Mi perfil",
        picture_url: user?.picture || "/Gilda.jpg",
        is_public: true,
      });
    }
  };

  useEffect(() => {
    if (isMyProfile) {
      loadMyProfile();
    } else {
      loadUser(id);
    }
  }, [id]);

  // Toggle público/privado: actualiza estado local y persiste en BD
  const handleTogglePublic = async () => {
    const newValue = !isPublic;
    setIsPublicState(newValue);
    setDisplayUser((prev) => ({ ...prev, is_public: newValue }));
    try {
      const token = await getAccessTokenSilently();
      await updateMyProfile(token, { is_public: newValue });
    } catch (error) {
      // Revertir si falla
      setIsPublicState(!newValue);
      setDisplayUser((prev) => ({ ...prev, is_public: !newValue }));
      console.error("Error actualizando visibilidad del perfil:", error);
    }
  };

  return (
    <ProfileView
      user_id={id}
      displayUser={displayUser}
      isMyProfile={isMyProfile}
      isPublic={isPublic}
      setIsPublic={handleTogglePublic}
    />
  );
}

export default Profile;
