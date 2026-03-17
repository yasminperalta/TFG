import { useAuth0 } from "@auth0/auth0-react";

function Profile() {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return <p>No autenticado</p>;

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
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
