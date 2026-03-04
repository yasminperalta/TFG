import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Perfil</h2>
      <p>Bienvenido: {user.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}