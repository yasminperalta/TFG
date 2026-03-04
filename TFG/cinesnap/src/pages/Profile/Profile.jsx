import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Cierra sesión en el contexto
    navigate("/login"); // Redirige al login
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Mi Perfil</h1>
        {user && (
          <>
            <p className="profile-email">Email: <strong>{user.email}</strong></p>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;