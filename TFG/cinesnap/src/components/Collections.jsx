import DVDCard from "./DVDCard";
import Scroll from "./Scroll";

function Collections() {
  return (
    <div className="relative min-h-screen m-0 font-sans text-white">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>

      {/* Overlay negro para oscurecer */}
      <div className="absolute inset-0 bg-black opacity-85"></div>
      {/* Ajusta opacity-50 a 60 o 70 para más oscuridad */}

      {/* Contenido principal */}
      <section className="relative text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">Mi colección</h2>
        <p>Aquí puedes ver las películas que has añadido a tu colección.</p>
        <br />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 justify-center">
          <DVDCard />
          <DVDCard />
          <DVDCard />
        </div>
      </section>
      {/* Botón Volver arriba */}
      <Scroll />
    </div>
  );
}

export default Collections;
