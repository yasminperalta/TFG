import { FaLink, FaTimes } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Iconos de corazón
import { addMovieToWishlist, removeMovieFromWishlist } from "../../services/wishlistService";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

function WishlistItem({ imdb_id, title, date, poster_url, stores, wishlist_movie_id }) {
  const [isSaved, setIsSaved] = useState(true);
  const { getAccessTokenSilently } = useAuth0();

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

  if (!stores) {
    stores = [];
  }
  const sortedStores = [...stores].sort((a, b) => a.price - b.price);

  return (
    <div className="group flex bg-white/5 backdrop-blur-xl hover:bg-white/2 p-6 rounded-3xl transition-all border border-white/5">

      {/* Poster */
        poster_url && (
          <img
            className="w-auto h-[270px] object-cover bg-neutral-600 rounded-lg"
            src={`https://image.tmdb.org/t/p/w500${poster_url}`}
            alt={title}
            srcSet=""
          />
        )}

      {!poster_url && (
        <div className="w-[140px] h-[200px] object-cover bg-neutral-600"></div>
      )}

      {/* Info */}
      <div className="flex-1 ml-6 text-left">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <h3 className="text-md mb-3">DVD {date}</h3>

        {/* Tiendas con links */}
        <div className="flex flex-col gap-1">
          {sortedStores.map((store, index) => (
            <a
              key={index}
              target="_blank"
              rel="noreferrer"
              className="grid grid-cols-3 items-center bg-neutral-700 p-2 rounded-md"
              href={store.link}
            >
              {/* Logo y Nombre */}
              <div className="flex items-center gap-3">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-6 h-6 rounded"
                />
                <span className="font-medium text-sm">{store.name}</span>
              </div>

              {/* Precio */}
              <div className="text-center text-sm">{store.price} €</div>

              {/* Botón visual (NO es link) */}
              <div className="text-right">
                <span className="bg-red-600 hover:bg-red-700 text-white text-sm py-1.5 px-3 rounded-md transition-all inline-block">
                  Comprar
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Botón Wishlist */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 text-white text-2xl p-2.5 rounded-full bg-black/50 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
        title="Quitarlo de la lista"
      >
        {isSaved ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>
      {/*
      <button
        onClick={onRemove}
        className="ml-4 flex items-center justify-center w-10 h-10 rounded-full 
             bg-neutral-700 text-white text-xl font-bold
             transition-all duration-200
             hover:bg-red-600 hover:scale-110 hover:text-white
             absolute -top-2 right-2"
      >
        <FaTimes />
      </button>
      */}
    </div>
  );
}

export default WishlistItem;
