import { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { useCollections } from "../context/CollectionsProvider";
import { addMovieToWishlist, removeMovieFromWishlist } from "../services/wishlistService";
import LoginToast from "./LoginToast";

function DVDCard({ imdb_id, saved, title, image, shareLink, onDelete, wishlist_movie_id, wishlist, collections = [] }) {
  const [isSaved, setIsSaved] = useState(saved);
  const [isCollected, setIsCollected] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  // Ref para tener siempre el id real de la entrada en wishlist
  const currentWishlistId = useRef(wishlist_movie_id);

  const { openSaveModal } = useCollections();

  // Estado del corazón — también sincroniza el id real
  useEffect(() => {
    const match = wishlist.find(w => parseInt(w.movie_details.imdb_id) === parseInt(imdb_id));
    setIsSaved(!!match);
    if (match) currentWishlistId.current = match.id;
  }, [wishlist]);

  // Estado del marcapáginas
  useEffect(() => {
    const movies = [];
    collections.forEach((col) => { col.movies.forEach(colMovie => { if (parseInt(colMovie.movie_details.imdb_id) === parseInt(imdb_id)) setIsCollected(true); }) });
  }, [collections])

  // BOTÓN DE WISHLIST
  const handleWishlist = async () => {
    if (!isAuthenticated) { setShowLoginToast(true); return; }
    try {
      const token = await getAccessTokenSilently();
      if (isSaved) {
        setIsSaved(false);
        await removeMovieFromWishlist(token, currentWishlistId.current);
        currentWishlistId.current = -1;
      } else {
        setIsSaved(true);
        const data = await addMovieToWishlist(token, imdb_id);
        currentWishlistId.current = data.id;
      }
    } catch (error) {
      console.error("Error en wishlist:", error);
      setIsSaved(prev => !prev);
    }
  };

  const handleSave = () => {
    if (!isAuthenticated) { setShowLoginToast(true); return; }
    openSaveModal({ title, image, imdb_id });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: `Mira esta película: ${title}`,
          url: shareLink,
        })
        .catch((err) => console.error("Error al compartir:", err));
    } else {
      navigator.clipboard.writeText(shareLink || window.location.href);
      alert("Enlace copiado al portapapeles!");
    }
  };

  return (
    <>
    <div className="group flex flex-col w-full max-w-[200px] items-center cursor-pointer relative bg-neutral-800 rounded-lg shadow-md overflow-hidden hover:scale-105 hover:ring-2 hover:ring-red-500 transition-transform">
      <img
        src={image}
        alt={title}
        className="w-full aspect-[2/3] object-cover"
      />

      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 text-white text-2xl p-2.5 rounded-full bg-black/50 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
        title={isSaved ? "Quitarlo de la lista de deseados" : "Agregar a la lista de deseados"}
      >
        {isSaved ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>

      <button
        onClick={handleSave}
        className="absolute top-2 left-2 text-white text-2xl p-2.5 rounded-full bg-black/50 hover:bg-green-600 transition opacity-0 group-hover:opacity-100"
        title={isCollected ? "Quitar de colección" : "Guardar en colección"}
      >
        {isCollected ? <BsBookmarkFill /> : <FiBookmark />}
      </button>

      <button
        onClick={handleShare}
        className="absolute bottom-2 right-2 text-white text-2xl p-2.5 rounded-full bg-black/50 hover:bg-blue-600 transition opacity-0 group-hover:opacity-100"
        title="Compartir"
      >
        <FiShare2 />
      </button>

      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute bottom-2 left-2 text-white text-2xl p-2.5 rounded-full bg-black/50 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
          title="Eliminar"
        >
          <FaTrash />
        </button>
      )}

      <div className="p-2 text-center h-[3.5rem] flex items-center justify-center">
        <p className="text-sm font-semibold line-clamp-2 leading-tight">{title}</p>
      </div>
    </div>

    {showLoginToast && <LoginToast onClose={() => setShowLoginToast(false)} />}
    </>
  );
}

export default DVDCard;