import { FaLink, FaTimes } from "react-icons/fa";

function WishlistItem({ title, image, stores, onRemove }) {
  return (
    <div className="flex items-center bg-neutral-800 rounded-lg p-4 shadow-md w-full">
      {/* Poster */}
      <img
        src={image || "https://via.placeholder.com/150x220"}
        alt={title}
        className="w-[100px] h-[150px] object-cover rounded-md"
      />

      {/* Info */}
      <div className="flex-1 ml-6 text-left">
        <h3 className="text-lg font-bold mb-2">{title}</h3>

        {/* Tiendas con links */}
        <div className="space-y-1 text-sm">
          {stores.map((store, index) => (
            <a
              key={index}
              href={store.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:underline hover:text-blue-400 cursor-pointer"
            >
              {store.name}:{" "}
              <span className="font-semibold">{store.price}€</span> <FaLink className="inline ml-1" />
            </a>
          ))}
        </div>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={onRemove}
        className="ml-4 flex items-center justify-center w-10 h-10 rounded-full 
             bg-neutral-700 text-white text-xl font-bold
             transition-all duration-200
             hover:bg-red-600 hover:scale-110 hover:text-white"
      >
        <FaTimes />
      </button>
    </div>
  );
}

export default WishlistItem;
