// Import Link (para navegar sin recargar) y
// useNavigate (para redirecciones programáticas) de React Router
// Import estilos específicos para el formulario de autenticación
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { z } from "zod";

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z.email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export default function LoginForm() {
  // Estado local para almacenar los datos ingresados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene que la página se recargue
    // Validación Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Simulación de login exitoso (acá iría la lógica de autenticación)
    login(email); // guarda el usuario en el contexto
    navigate("/profile"); // redirige después de login
  };;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232239] to-[#204989] font-sans p-4">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input para correo electrónico */}
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email} // valor controlado por el estado
              onChange={(e) => setEmail(e.target.value)} // actualiza el estado al escribir
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Input para contraseña */}
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Botón para enviar el formulario */}
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Texto con enlace para ir a registro */}
        <p className="text-gray-500 text-sm mt-4">
          ¿No tienes cuenta?
          <Link
            to="/register"
            className="text-indigo-600 font-semibold ml-1 hover:underline"
          >
            {" "}
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
