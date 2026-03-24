import { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Iconos de corazón
import { FiShare2 } from "react-icons/fi"; // Icono de compartir

function DVDCard({ title, image, onAddToWishlist, shareLink }) {
  const [saved, setSaved] = useState(false);

  // Maneja el clic en el botón de wishlist
  const handleWishlist = () => {
    setSaved(!saved); // Cambia el estado del corazón
    if (!saved && onAddToWishlist) {
      onAddToWishlist({ title, image }); // Llama al callback del padre
    }
  };

  // Maneja el clic en el botón de compartir
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
      // Alternativa: copiar enlace al portapapeles
      navigator.clipboard.writeText(shareLink || window.location.href);
      alert("Enlace copiado al portapapeles!");
    }
  };
  return (
    <div className="group relative bg-neutral-800 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform">
      {/* Imagen del DVD */}
      <img
        src={image || "https://via.placeholder.com/300x450"}
        alt={title}
        className="w-full h-[270px] object-cover"
      />

      {/* Botón Wishlist */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 text-white text-2xl p-2.5 rounded-full bg-black/50 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
        title={saved ? "Quitarlo de la lista" : "Agregar a la lista"}
      >
        {saved ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>

      {/* Botón Compartir */}
      <button
        onClick={handleShare}
        className="absolute bottom-2 right-2 text-white text-2xl p-2.5 rounded-full bg-black/50 hover:bg-blue-600 transition opacity-0 group-hover:opacity-100"
        title="Compartir"
      >
        <FiShare2 />
      </button>

      {/* Título */}
      <div className="p-2 text-center">
        <p className="text-sm font-semibold">{title}</p>
      </div>
    </div>
  );
}

export default DVDCard;
