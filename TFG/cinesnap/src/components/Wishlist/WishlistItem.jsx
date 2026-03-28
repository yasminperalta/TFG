import { FaLink, FaTimes } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Iconos de corazón

function WishlistItem({ title, date, image, stores, onRemove }) {

  const sortedStores = [...stores].sort((a, b) => a.price - b.price);

  return (
    <div className="group flex bg-neutral-800 rounded-lg p-4 shadow-md w-full relative">
      {/* Poster 
      <img
        src={image || "https://via.placeholder.com/150x220"}
        alt={title}
        className="w-[100px] h-[150px] object-cover rounded-md"
      />
      */}

      <div className="w-[140px] h-[200px] object-cover bg-neutral-600">
      </div>

      {/* Info */}
      <div className="flex-1 ml-6 text-left">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <h3 className="text-md mb-3">DVD {date}</h3>

        {/* Tiendas con links */}
        <div className="flex flex-col gap-1">
          {sortedStores.map((store, index) => (
            <a
              key={index}
              target="blank"
              className="grid grid-cols-3 items-center bg-neutral-700 p-2 rounded-md"
              href={store.link}>

              {/* Logo y Nombre */}
              <div className="flex items-center gap-3">
                <img src={store.logo} alt={store.name} className="w-6 h-6 rounded" />
                <span className="font-medium text-sm">{store.name}</span>
              </div>

              {/* Precio */}
              <div className="text-center text-sm">
                {store.price} €
              </div>

              {/* Botón */}
              <div className="text-right">
                <a href={store.link} target="blank" className="bg-red-600 hover:bg-red-700 text-white text-sm py-1.5 px-3 rounded-md transition-all">
                  Comprar
                </a>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Botón Wishlist */}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-white text-2xl p-2.5 rounded-full bg-black/50 hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
        title="Quitarlo de la lista"
      >
        <AiFillHeart />
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
