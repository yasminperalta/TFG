import { useState } from "react";
import WishlistItem from "./WishlistItem";
import Scroll from "../Scroll";

function Wishlist() {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Inception",
      date: 2010,
      image: "https://via.placeholder.com/150x220",
      stores: [
        {
          logo: "https://cdn-gdjgd.nitrocdn.com/puszgbaFBTTMTmzNUiCrRdNAekkabGtJ/assets/images/optimized/rev-01693b6/policyviz.com/wp-content/uploads/2020/12/amazon-logo-square-285x300.jpg",
          name: "Amazon",
          price: 11.2,
          link: "https://www.amazon.es/Origen-Blu-ray-Gordon-Levitt-Leonardo-DiCaprio/dp/B08LB2K9GK/ref=sr_1_2?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2CJDRDLKP4U20&dib=eyJ2IjoiMSJ9.xhhFE3n6UKNaUOhmSWXQlQWtGpFgpglImXK-aVZFqPxYCe8kPYUpfg1sCEgqcfUmPV9HA0k5BMhb4v3u7BtZXHtpapjs2CG4i7pWHgG60upijSn6NCm3uAKoKdQ_aBSvmYwEdBVaDQALqt-VNxT0gB-GZMb-xq46tHo7aqR6T3qe9yZkTBnjEO16lZ2ezISTwzE-asVUZonQRXPkhjYgO3ucas_FL89_3fW_twuaVqdQ7QpKV4QAcdC-4Gqf5hs1Q1os1fRlA1_A75JIhblmdXDadQq4w5waEShLDH9Ryvc.wN0xO5AzbDt6ho1xxcHw-IFodpX9eBceNaI5j8WepRE&dib_tag=se&keywords=inception&qid=1774347914&sprefix=inception%2Caps%2C406&sr=8-2",
        },
        {
          logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Fnac_Logo.svg",
          name: "Fnac",
          price: 11.99,
          link: "https://www.fnac.es/a7797231/Origen-Blu-ray-Leonardo-DiCaprio",
        },
      ],
    },
    {
      id: 2,
      title: "Interstellar",
      date: 2014,
      image: "https://via.placeholder.com/150x220",
      stores: [
        {
          logo: "https://cdn-gdjgd.nitrocdn.com/puszgbaFBTTMTmzNUiCrRdNAekkabGtJ/assets/images/optimized/rev-01693b6/policyviz.com/wp-content/uploads/2020/12/amazon-logo-square-285x300.jpg",
          name: "Amazon",
          price: 34.99,
          link: "https://www.amazon.es/HWC-Trading-Interstellar-Mcconaughey-Imprimieron/dp/B09DSV52DC/ref=sr_1_1_sspa?adgrpid=1309518783566525&dib=eyJ2IjoiMSJ9.hDjHPFA6ekNZbocosdB43xk_2TnhZkw1DvUpm_LMqgk37ATqwNwJKI21HGChLs4JUpFUJmQddO0nXpixhrZMhGUB1b0QwoPbEwRnAL1PBIUGzLO-lkf4vBGpeB3n0SalbkIww_pAXiP89kLoSkHTh1nxhvR3F7H9mKjkWPX1q-UVorZWICKiQxQdHzWuxkkbG1eAaYt-4ZEDmsltaMqsq1gT8CiaDWvoctsHLeYAAXmBo_x_D2VuFKz2uJ0U9uXR6WXsAy_p6fdDisGBilx680PDM3xg3FTM_E4TuiJOAII.k_iXWIMgH1jfXreXiq_gcQvY1cdzuGkZ9n6BkURUSwo&dib_tag=se&hvadid=81845012637226&hvbmt=bp&hvdev=c&hvlocphy=164580&hvnetw=o&hvqmt=p&hvtargid=kwd-81845158896748%3Aloc-170&hydadcr=14551_1862904&keywords=interstellar&mcid=108077b382a73a0bb59ab04b418da524&msclkid=b8d8710f656217c8293b18cd0324568a&qid=1774347850&sr=8-1-spons&aref=7TTvP7iVVg&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1",
        },
        {
          logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Fnac_Logo.svg",
          name: "Fnac",
          price: 19.99,
          link: "https://www.fnac.es/a7725135/Interstellar-UHD-Blu-ray-Matthew-McConaughey",
        },
      ],
    },
  ]);

  const removeMovie = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };
  return (
    <div className="relative min-h-screen m-0 font-sans text-white">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 bg-cinema-pattern bg-repeat"></div>

      {/* Overlay negro para oscurecer */}
      <div className="absolute inset-0 bg-black opacity-85"></div>
      {/* Ajusta opacity-50 a 60 o 70 para más oscuridad */}

      {/* Contenido principal */}
      <section className="relative text-center mt-12 p-10">
        <h2 className="text-4xl mb-5">Lista de deseados</h2>
        <p>
          Aquí puedes ver las películas que has añadido a tu lista de deseados.
        </p>
        <div className="flex flex-col gap-4 mt-8 max-w-4xl mx-auto">
          {movies.map((movie) => (
            <WishlistItem
              key={movie.id}
              title={movie.title}
              date={movie.date}
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
