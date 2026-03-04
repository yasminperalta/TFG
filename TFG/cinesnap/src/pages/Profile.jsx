import { useAuth } from "../context/useAuth";

function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      { /*Botón para cerrar sesión y comprobar que se están
      guardando los datos correctamente */}
      <button onClick={logout}>Cerrar sesión {user.email}</button>
    </div>
  );
}

export default Profile;