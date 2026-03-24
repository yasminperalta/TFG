import { useState } from "react";
import WishlistItem from "./WishlistItem";
import Scroll from "../Scroll";

function Wishlist() {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Inception",
      image: "https://via.placeholder.com/150x220",
      stores: [
        {
          name: "Amazon",
          price: 12.99,
          link: "https://www.amazon.com/Inception-Leonardo-DiCaprio/dp/B0047WJ11G",
        },
        {
          name: "Fnac",
          price: 14.5,
          link: "https://www.fnac.com/a123456/Inception-Leonardo-DiCaprio",
        },
        {
          name: "El Corte Inglés",
          price: 13.75,
          link: "https://www.elcorteingles.es/peliculas/inception",
        },
      ],
    },
    {
      id: 2,
      title: "Interstellar",
      image: "https://via.placeholder.com/150x220",
      stores: [
        {
          name: "Amazon",
          price: 10.99,
          link: "https://www.amazon.com/Interstellar-Tom-Hanks/dp/B0047WJ11G",
        },
        {
          name: "Fnac",
          price: 13.2,
          link: "https://www.fnac.com/a123456/Interstellar-Tom-Hanks",
        },
        {
          name: "MediaMarkt",
          price: 11.95,
          link: "https://www.mediamarkt.es/peliculas/interstellar",
        },
      ],
    },
  ]);

  const removeMovie = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };
  return (
    <div className="m-0 font-sans bg-neutral-900 text-white min-h-screen">
      <section className="text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">Lista de deseados</h2>
        <p>
          Aquí puedes ver las películas que has añadido a tu lista de deseados.
        </p>
        <div className="flex flex-col gap-4 mt-8 max-w-4xl mx-auto">
          {movies.map((movie) => (
            <WishlistItem
              key={movie.id}
              title={movie.title}
              image={movie.image}
              stores={movie.stores}
              onRemove={() => removeMovie(movie.id)}
            />
          ))}
        </div>
      </section>
      {/* Botón Volver arriba */}
      <Scroll />
    </div>
  );
}

export default Wishlist;
