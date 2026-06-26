import UploadImage from "../components/UploadImage";
import Famous from "../components/Famous";

function Home() {
  return (
    <>
      {/* Contenido principal */}
      <div className="relative p-3 sm:p-6 md:p-10 mt-12">
        <UploadImage />
        <Famous />
      </div>
    </>
  );
}

export default Home;
