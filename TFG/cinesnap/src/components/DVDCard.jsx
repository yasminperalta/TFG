function DVDCard({ title, image }) {
  return (
    <div className="bg-neutral-800 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform">
      {/* Imagen del DVD */}
      <img
        src={image || "https://via.placeholder.com/300x450"}
        alt={title}
        className="w-full h-[270px] object-cover"
      />

      {/* Título */}
      <div className="p-2 text-center">
        <p className="text-sm font-semibold">{title}</p>
      </div>
    </div>
  );
}

export default DVDCard;
