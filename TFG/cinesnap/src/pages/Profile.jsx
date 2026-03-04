import { useAuth } from "../context/useAuth";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <button onClick={logout}>Cerrar sesión {user.email}</button>
    </div>
  );
}