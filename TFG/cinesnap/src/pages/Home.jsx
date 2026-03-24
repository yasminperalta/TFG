import UploadImage from "../components/UploadImage";
import Famous from "../components/Famous";

function Home() {
  return (
    <>
      <div className="relative min-h-screen m-0 font-sans text-white">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>

        {/* Overlay negro para oscurecer */}
        <div className="absolute inset-0 bg-black opacity-85"></div>
        {/* Ajusta opacity-50 a opacity-60 o opacity-70 para más oscuridad */}

        {/* Contenido principal */}
        <div className="relative p-10 mt-12">
          {/* <h1 className="text-5xl leading-tight mb-10">CineSnap</h1> */}
          <UploadImage />
          <Famous />
        </div>
      </div>
    </>
  );
}

export default Home;
