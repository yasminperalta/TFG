import UploadImage from "../components/UploadImage";
import Collection from "../components/Collections";
import Famous from "../components/Famous";
import { useAuth0 } from "@auth0/auth0-react";

function Home() {
  // Obtener estado de autenticación
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <div className="m-0 font-sans bg-neutral-900 text-white min-h-screen">
        <div className="p-10 mt-12">
          {/* <h1 className="text-5xl leading-tight mb-10">CineSnap</h1> */}
          <UploadImage />
          {/* Mostrar Collection solo si el usuario está logueado */}
          {isAuthenticated && <Collection />}
          {/* Mostrar Famous solo si el usuario no está logueado */}
          {!isAuthenticated && <Famous />}
        </div>
      </div>
    </>
  );
}

export default Home;
