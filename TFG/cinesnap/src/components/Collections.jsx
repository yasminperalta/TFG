import DVDCard from "./DVDCard";
import Scroll from "./Scroll";

function Collections() {
  return (
    <div className="m-0 font-sans bg-neutral-900 text-white min-h-screen">
      <section className="text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">Mi colección</h2>
        <p>
          Aquí puedes ver las películas que has añadido a tu colección.
        </p>
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
