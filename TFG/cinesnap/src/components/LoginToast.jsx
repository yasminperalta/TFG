import { createPortal } from "react-dom";
import { useAuth0 } from "@auth0/auth0-react";

function LoginToast({ onClose }) {
  const { loginWithRedirect } = useAuth0();

  // Portal: renderiza en document.body para evitar que transforms/overflow de ancestros
  // rompan el posicionamiento fixed
  return createPortal(
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-neutral-800 border border-white/10 rounded-2xl shadow-2xl px-6 py-4">
      <span className="text-white text-sm whitespace-nowrap">
        Inicia sesión para usar esta función
      </span>
      <button
        onClick={() => loginWithRedirect()}
        className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition whitespace-nowrap"
      >
        Iniciar sesión
      </button>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white text-xl leading-none ml-1"
      >
        ✕
      </button>
    </div>,
    document.body
  );
}

export default LoginToast;
