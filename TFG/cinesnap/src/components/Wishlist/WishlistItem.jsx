import { FaLink, FaTimes } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { addMovieToWishlist, removeMovieFromWishlist } from "../../services/wishlistService";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useCollections } from "../../context/CollectionsProvider";

function WishlistItem({ imdb_id, title, date, poster_url, stores, wishlist_movie_id }) {
  const [isSaved, setIsSaved] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const { notifyWishlistChanged } = useCollections();

  const addToWishlist = async () => {
    try {
      const token = await getAccessTokenSilently();
      await addMovieToWishlist(token, imdb_id);
    } catch (error) {
      console.error("Error añadiendo a wishlist:", error);
    }
  };

  const removeFromWishlist = async () => {
    try {
      const token = await getAccessTokenSilently();
      await removeMovieFromWishlist(token, wishlist_movie_id);
      notifyWishlistChanged();
    } catch (error) {
      console.error("Error añadiendo a wishlist:", error);
    }
  };

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
    <div className="group flex flex-col sm:flex-row bg-white/5 backdrop-blur-xl hover:bg-white/2 p-4 sm:p-6 rounded-3xl transition-all border border-white/5">

      {/* Poster */}
      {poster_url && (
        <img
          className="w-full sm:w-auto h-[200px] sm:h-[270px] object-cover bg-neutral-600 rounded-lg shrink-0"
          src={`https://image.tmdb.org/t/p/w500${poster_url}`}
          alt={title}
          srcSet=""
        />
      )}

      {!poster_url && (
        <div className="w-full sm:w-[140px] h-[160px] sm:h-[200px] object-cover bg-neutral-600 rounded-lg shrink-0"></div>
      )}

      {/* Info */}
      <div className="flex-1 mt-4 sm:mt-0 sm:ml-6 text-left min-w-0">
        <h3 className="text-base sm:text-xl font-bold mb-1 truncate">{title}</h3>
        <h3 className="text-md mb-3">DVD {date}</h3>

        {/* Tiendas con links */}
        <div className="flex flex-col gap-1">
          {/* Tiendas dinámicas */}
          {sortedStores.length > 0 ? (
            sortedStores.map((store, index) => (
              <a
                key={index}
                target="_blank"
                rel="noreferrer"
                className="grid grid-cols-3 items-center bg-neutral-700 p-2 rounded-md"
                href={store.link}
              >
                <div className="flex items-center gap-3">
                  <img src={store.logo} alt={store.name} className="w-6 h-6 rounded" />
                  <span className="font-medium text-sm">{store.name}</span>
                </div>
                <div className="text-center text-sm">
                  {store.price > 0 ? `${store.price} €` : "?"}
                </div>
                <div className="text-right">
                  <span className="bg-red-600 hover:bg-red-700 text-white text-sm py-1.5 px-3 rounded-md transition-all inline-block">
                    Comprar
                  </span>
                </div>
              </a>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Enlace a Amazon</p>
          )}

          {/* Enlace fijo a Amazon */}
          <a
            href={`https://www.amazon.es/s?k=${encodeURIComponent(title + " DVD")}`}
            target="_blank"
            rel="noreferrer"
            className="grid grid-cols-3 items-center bg-neutral-700 hover:bg-neutral-600 p-2 rounded-md mt-1 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://www.amazon.es/favicon.ico"
                alt="Amazon"
                className="w-6 h-6 rounded"
              />
              <span className="font-medium text-sm">Amazon</span>
            </div>
            <div className="text-center text-sm text-gray-400">—</div>
            <div className="text-right">
              <span className="bg-red-600 hover:bg-red-700 text-white text-sm py-1.5 px-3 rounded-md transition-all inline-block">
                Buscar
              </span>
            </div>
          </a>
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
    </div>
  );
}

export default WishlistItem;