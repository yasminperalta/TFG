import { useEffect, useState } from "react";

function Scroll() {
    const [showTop, setShowTop] = useState(false); // botón volver arriba

    // Detectar scroll
    useEffect(() => {
      const handleScroll = () => {
        setShowTop(window.scrollY > 300);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  return (
    <>  
    {/* Botón Volver arriba */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-red-600 w-14 h-14 flex items-center justify-center rounded-full shadow-xl hover:bg-red-700 transition transform hover:scale-110"
        >
          <span className="text-white text-3xl">⬆</span>
        </button>
      )}
    </>
  ); 
}

export default Scroll;
