import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { useCollections } from "../context/CollectionsProvider";
import { addMovieToWishlist, removeMovieFromWishlist } from "../services/wishlistService";

function DVDCard({ imdb_id, saved, title, image, shareLink, onDelete, wishlist_movie_id, wishlist }) {
  const [isSaved, setIsSaved] = useState(saved);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const { openSaveModal } = useCollections();

  useEffect(() => {
    setIsSaved(wishlist.some(wishlistmovie => parseInt(wishlistmovie.movie_details.imdb_id) === parseInt(imdb_id)));
  }, [wishlist]);

  // AÑADIR PELÍCULA A WISHLIST
  const addToWishlist = async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await addMovieToWishlist(token, imdb_id);

      console.log(data);
    } catch (error) {
      console.error("Error añadiendo a wishlist:", error);
    }
  };

  // ELIMINAR PELÍCULA DE WISHLIST
  const removeFromWishlist = async () => {
    try {
      const token = await getAccessTokenSilently();

      await removeMovieFromWishlist(token, wishlist_movie_id);
    } catch (error) {
      console.error("Error añadiendo a wishlist:", error);
    }
  };

  // BOTÓN DE WISHLIST
  const handleWishlist = async () => {
    if (isSaved) {
      setIsSaved(false);
      removeFromWishlist();
    }
    if (!isSaved) {
      setIsSaved(true);
      addToWishlist();
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
    <div className="group flex flex-col items-center cursor-pointer relative bg-neutral-800 rounded-lg shadow-md overflow-hidden hover:scale-105 hover:ring-2 hover:ring-red-500 transition-transform">
      <img
        src={`https://image.tmdb.org/t/p/w500${image}` || "https://via.placeholder.com/300x450"}
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
        title={isSaved ? "Quitar de colección" : "Guardar en colección"}
      >
        {isSaved ? <BsBookmarkFill /> : <FiBookmark />}
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