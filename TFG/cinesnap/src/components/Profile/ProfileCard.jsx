function ProfileCard({ displayUser, isMyProfile, isPublic, setIsPublic }) {

  return (<div>
    <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
      {/* Foto de Perfil con borde de acento */}
      <div className="relative">
        <img
          src={displayUser.picture_url || "/Gilda.jpg"}
          alt="Profile"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#1a1a1a] shadow-xl object-cover ring-2 ring-red-600/50"
        />
        {isMyProfile && (
          <div className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-[#1a1a1a]"></div>
        )}
      </div>

      {/* Información del Usuario */}
      <div className="flex-1 text-center md:text-left mb-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 truncate max-w-full">{displayUser.username}</h1>
        <p className="text-gray-400 text-sm sm:text-lg mb-4 truncate">{displayUser.email || ""}</p>

        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium uppercase tracking-wider text-gray-300">
            {displayUser.is_public ? "Perfil Público" : "Perfil Privado"}
          </span>

          {isMyProfile && (
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-full">
              <span className="text-xs text-gray-400">Privacidad:</span>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`w-10 h-5 flex items-center rounded-full px-1 transition duration-300 ${isPublic ? "bg-red-600" : "bg-gray-600"
                  }`}
              >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isPublic ? "translate-x-5" : ""}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

  </div>
  );
}

export default ProfileCard;
