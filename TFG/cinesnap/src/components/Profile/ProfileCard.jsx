function ProfileCard({ displayUser, isMyProfile, isPublic, setIsPublic }) {
  return (
    <>
      <h1 className="text-2xl text-gray-800 mb-7">{displayUser.profile}</h1>

      <div className="space-y-4 text-left">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={displayUser.name}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            value={displayUser.email}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1">Foto</label>
          {displayUser.picture && (
            <img
              src={displayUser.picture}
              alt="Profile"
              className="w-24 h-24 rounded-full border border-gray-300"
            />
          )}
        </div>

        {/* Toggle solo en mi perfil */}
        {isMyProfile && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-gray-700 font-semibold">Perfil público</span>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
                isPublic
                  ? "bg-green-500 justify-end"
                  : "bg-gray-300 justify-start"
              }`}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
            </button>
          </div>
        )}

        <p className="text-blue-500 mt-2 text-sm">
          Perfil actualmente:{" "}
          <span className="font-semibold">
            {displayUser.isPublic ? "Público" : "Privado"}
          </span>
        </p>
      </div>
    </>
  );
}

export default ProfileCard;
