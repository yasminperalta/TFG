import ProfileCard from "./ProfileCard";
import FollowButton from "./FollowButton";
import { useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { FaGlobe, FaShare } from "react-icons/fa";
import CollectionsCarousel from "../Collection/CollectionsCarousel";

function ProfileView({
  displayUser,
  isMyProfile,
  isPublic,
  setIsPublic,
  isFriend,
  isRequested,
  isNotFriend,
}) {
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [collections, setCollections] = useState([{ description: "", id: 3, is_public: true, movies: [], name: "PruebaCol", owner_name: "guille", user: 1 }]);

  return (
    <div className="relative min-h-screen m-0 font-sans text-white mt-12 p-10">
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
            isPublic={displayUser.isPublic} // Si el perfil es público
            isFriend={isFriend} // Si ya es amigo
            isRequested={isRequested} // Si hay solicitud pendiente
            isNotFriend={isNotFriend} // Si es usuario nuevo
          />
        )}

        <section className="space-y-10 mt-5 ">

          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-[2px] bg-red-600"></span>
            Listas
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <ThreeDot color={["#dc2626"]} />
            </div>
          ) : (
            collections
              .filter(col => col.name !== "Mi colección")
              .map((col) => (
                <div key={col.id} className="bg-white/5 backdrop-blur-xl hover:bg-white/2 p-6 rounded-3xl transition-all border border-white/5">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xl font-semibold">{col.name}</h3>
                    <span className="text-gray-600">|</span>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded uppercase tracking-widest text-gray-400">
                      {col.movies.length} títulos
                    </span>

                    <div className="ml-auto flex items-center gap-4">
                      {col.is_public ? <FaGlobe className="text-blue-400" title="Pública" /> : <FaLock className="text-gray-500" title="Privada" />}
                      {col.is_public && (
                        <button onClick={() => shareCollection(col)} className="p-2 hover:bg-red-500/20 rounded-full text-[#ff6347] transition">
                          <FaShare size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <CollectionsCarousel
                    wishlist={wishlist}
                    movies={col.movies.map(m => ({
                      id: parseInt(m.movie_details?.imdb_id || m.imdb_id),
                      title: m.movie_details?.title || m.title,
                      image: m.movie_details?.poster_url || m.image
                    }))}
                    showDelete={true}
                    onDeleteMovie={(idx) => handleRemoveMovie(col.id, idx)}
                  />
                </div>
              ))
          )}

        </section>
      </div>
    </div>
  );
}

export default ProfileView;
