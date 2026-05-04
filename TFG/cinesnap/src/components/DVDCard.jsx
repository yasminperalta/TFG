import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { useCollections } from "../context/CollectionsProvider";
import { useAuth0 } from "@auth0/auth0-react";
import { addMovieToWishlist, removeMovieFromWishlist, getWishlistMovies } from "../services/wishlistService";

function DVDCard({ imdb_id, saved, title, image, shareLink, onDelete, wishlist_movie_id }) {
  const [isInCollection, setIsInCollection] = useState(false);
  const [isSaved, setIsSaved] = useState(saved);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const { openSaveModal } = useCollections();

  const addToWishlist = async (movie) => {
    try {
      const token = await getAccessTokenSilently();

      const data = await addMovieToWishlist(token, movie.imdb_id);
      console.log(data);
    } catch (error) {
      console.error("Error añadiendo a wishlist:", error);
    }
  };

  const removeFromWishlist = async (movie) => {
    try {
      const token = await getAccessTokenSilently();

      await removeMovieFromWishlist(token, movie.imdb_id, wishlist_movie_id);
    } catch (error) {
      console.error("Error añadiendo a wishlist:", error);
    }
  };

  const handleWishlist = async () => {
    if (isSaved) {
      setIsSaved(false);
      removeFromWishlist({ title, image, imdb_id });
    }
    if (!isSaved) {
      setIsSaved(true);
      addToWishlist({ title, image, imdb_id });
    }
  };

  const handleSave = () => {
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
    <div className="group relative bg-neutral-800 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform">
      <img
        src={image || "https://via.placeholder.com/300x450"}
        alt={title}
        className="w-full h-[270px] object-cover"
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
        title={isInCollection ? "Quitar de colección" : "Guardar en colección"}
      >
        {isInCollection ? <BsBookmarkFill /> : <FiBookmark />}
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

      <div className="p-2 text-center">
        <p className="text-sm font-semibold">{title}</p>
      </div>
    </div>
  );
}

export default DVDCard;