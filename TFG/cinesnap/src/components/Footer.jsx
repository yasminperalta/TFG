import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Contenido principal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-blue-400">DioTeca</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Conectando personas de forma simple y divertida.
            </p>
          </div>

          {/* Navegación */}
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-blue-400 transition">
              Inicio
            </Link>
            <Link to="/profile" className="hover:text-blue-400 transition">
              Perfil
            </Link>
            <Link to="/collection" className="hover:text-blue-400 transition">
              Colección
            </Link>
            <Link to="/wishlist" className="hover:text-blue-400 transition">
              Deseados
            </Link>
          </div>

          {/* Redes */}
          <div className="flex gap-5 text-xl">
            <a href="#" className="hover:text-blue-400 transition">
              <FaGithub />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaLinkedin />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaTwitter />
            </a>
          </div>
          {/* Correo de contacto */}
          <a
            href="mailto:contacto@dioteca.com"
            className="flex items-center gap-2 hover:text-blue-400 transition mt-2 md:mt-0"
          >
            <FaEnvelope /> contacto@dioteca.com
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DioTeca
        </div>
      </div>
    </footer>
  );
}

export default Footer;
