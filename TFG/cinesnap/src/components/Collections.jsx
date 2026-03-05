import DVDCard from "./DVDCard";

function Collections() {
  return (
    <div className="m-0 font-sans bg-neutral-900 text-white min-h-screen">
      <section className="text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">
          Mi colección (MOSTRAR SOLO CUANDO SE HAYA INICIADO SESIÓN (sino, se
          puede mostrar "los más buscados/populares" o algo de ese estilo))
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 justify-center">
          <DVDCard />
          <DVDCard />
          <DVDCard />
        </div>
      </section>
    </div>
  );
}

export default Collections;
