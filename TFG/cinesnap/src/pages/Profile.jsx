// Importamos el hook de Auth0 para obtener información del usuario y su estado de autenticación
import { useAuth0 } from "@auth0/auth0-react";

function Profile() {
  // Extraemos información del usuario
  const { user, isAuthenticated } = useAuth0();

  // Si el usuario no está autenticado, mostramos un mensaje simple
  if (!isAuthenticated) return <p>No autenticado</p>;

  // Renderizamos la página de perfil
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232239] to-[#204989] font-sans mt-10 p-5">
      <div className="bg-white p-10 rounded-xl w-full max-w-md shadow-lg text-center">
        <h1 className="text-2xl text-gray-800 mb-7">Mi Perfil</h1>

        <div className="space-y-4 text-left">
          {/* Nombre del usuario */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={user.name || ""} // Muestra el nombre de Auth0, o vacío si no existe
              disabled // No se puede editar desde la app
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Email del usuario */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              value={user.email || ""} // Muestra el email de Auth0
              disabled // No se puede editar desde la app
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* ID de usuario de Auth0 */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Usuario Auth0 ID
            </label>
            <input
              type="text"
              value={user.sub} // 'sub' es el identificador único de Auth0
              disabled
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Foto de perfil */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Foto
            </label>
            {user.picture && (
              <img
                src={user.picture} // URL de la foto del perfil de Auth0
                alt="Profile"
                className="w-24 h-24 rounded-full border border-gray-300"
              />
            )}
          </div>
        </div>

        {/* Mensaje informativo para cambiar datos sensibles */}
        <p className="text-gray-500 mt-4 text-sm">
          Para cambiar email, contraseña o nombre, usa la plataforma de Auth0.
        </p>
      </div>
    </div>
  );
}

export default Profile;
