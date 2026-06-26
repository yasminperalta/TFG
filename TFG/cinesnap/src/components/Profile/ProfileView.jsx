import ProfileCard from "./ProfileCard";
import FollowButton from "./FollowButton";
import { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { FaGlobe, FaShare } from "react-icons/fa";
import CollectionsCarousel from "../Collection/CollectionsCarousel";
import { getUserCollections, getYourCollections } from "../../services/collectionService";
import { useAuth0 } from "@auth0/auth0-react";
import { getFriendStatus } from "../../services/friendService";

function ProfileView({
  user_id,
  displayUser,
  isMyProfile,
  isPublic,
  setIsPublic,
}) {
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [collections, setCollections] = useState([]);
  const [maxVisible, setMaxVisible] = useState(5);
  const [friendStatus, setFriendStatus] = useState(null);

  const { getAccessTokenSilently } = useAuth0();

  // Ajustar maxVisible según ancho de pantalla (igual que Famous grid)
  useEffect(() => {
    const updateMaxVisible = () => {
      const width = window.innerWidth;
      if (width >= 1280) setMaxVisible(7);      // xl
      else if (width >= 1024) setMaxVisible(5); // lg
      else if (width >= 768) setMaxVisible(4);  // md
      else if (width >= 640) setMaxVisible(3);  // sm
      else setMaxVisible(2);                    // mobile
    };
    updateMaxVisible();
    window.addEventListener('resize', updateMaxVisible);
    return () => window.removeEventListener('resize', updateMaxVisible);
  }, []);

  // CARGA DE COLECCIONES
  const loadCollections = async () => {
    try {
      const cols = await getUserCollections(user_id);
      setCollections(cols);
    } catch (error) {
      console.error("Error recuperando colecciones:", error);
    }
  };

  const loadYourCollections = async () => {
    try {
      const token = await getAccessTokenSilently();
      const cols = await getYourCollections(token);
      setCollections(cols);
    } catch (error) {
      console.error("Error recuperando tus colecciones:", error);
    }
  };

  useEffect(() => {
    if (user_id) {
      loadFriendStatus();
      loadCollections();
    } else {
      setFriendStatus(null);
      loadYourCollections();
    }
  }, [user_id]);

  // CARGAR ESTADO DE AMISTAD CON EL PERFIL
  const loadFriendStatus = async () => {
    try {
      const token = await getAccessTokenSilently();
      const status = await getFriendStatus(token, user_id);
      setFriendStatus(status);
    } catch (error) {
      console.error("Error recuperando estado de amistad:", error);
    }
  }

  return (
    <div className="relative min-h-screen m-0 font-sans text-white mt-12 p-4 sm:p-6 md:p-10">
      <div>
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
            userId={user_id}
            status={friendStatus}
            isTargetPublic={displayUser?.is_public}
            onStatusChange={loadFriendStatus}
          />
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <ThreeDot color={["#dc2626"]} />
          </div>
        ) : isMyProfile || friendStatus?.[0]?.status === "friend" ? (
          <section className="space-y-10 mt-5">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-8 h-[2px] bg-red-600"></span>
              Colecciones públicas
            </h2>
            {collections
              .filter(col => col.name !== "Mi colección")
              .map((col) => (
                <CollectionsCarousel
                  key={col.id}
                  wishlist={wishlist}
                  movies={col.movies.map(m => ({
                    id: parseInt(m.movie_details?.imdb_id || m.imdb_id),
                    title: m.movie_details?.title || m.title,
                    image: m.movie_details?.poster_url || m.image
                  }))}
                  showDelete={true}
                  onDeleteMovie={(idx) => handleRemoveMovie(col.id, idx)}
                  col={col}
                  maxVisible={maxVisible}
                />
              ))}
          </section>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {friendStatus?.[0]?.status === "requested" ? (
              <>
                <p className="text-lg font-medium">Solicitud pendiente</p>
                <p className="text-sm">Las listas serán visibles cuando acepte tu solicitud.</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">Contenido privado</p>
                <p className="text-sm">Sigue a este usuario para ver sus listas.</p>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfileView;
