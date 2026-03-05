import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Cierra sesión en el contexto
    navigate("/login"); // Redirige al login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232239] to-[#204989] font-sans p-5">
      <div className="bg-white p-10 rounded-xl w-full max-w-md shadow-lg text-center">
        <h1 className="text-2xl text-gray-800 mb-7">Mi Perfil</h1>
        {user && (
          <>
            <p className="profile-email">
              Email:{" "}
              <strong className="text-indigo-600 font-semibold">
                {user.email}
              </strong>
            </p>
            <br></br>
            <button
              className="w-full p-3 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
