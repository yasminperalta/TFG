import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiShare2 } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
import { BsBookmarkFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { useCollections } from "../context/CollectionsProvider";

function DVDCard({ imdb_id, title, image, onAddToWishlist, shareLink, onDelete }) {
  const [saved, setSaved] = useState(false);
  const [isInCollection, setIsInCollection] = useState(false);

  const { openSaveModal } = useCollections();

  const handleWishlist = () => {
    setSaved(!saved);
    if (!saved && onAddToWishlist) {
      onAddToWishlist({ title, image, imdb_id });
    }
  };

  const handleSave = () => {
    openSaveModal({ title, image });
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
        title={saved ? "Quitarlo de la lista de deseados" : "Agregar a la lista de deseados"}
      >
        {saved ? <AiFillHeart /> : <AiOutlineHeart />}
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