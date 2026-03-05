import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { z } from "zod";

// Esquema de validación con Zod
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Componente de registro de usuarios
export default function Register() {
  // Estados locales para guardar la información del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  // Hook de React Router para redirigir al usuario
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // evita que la página se recargue

    // Verifica que las contraseñas coincidan
    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Registro simulado
    login(email);
    navigate("/profile"); // después de registrarse redirige al perfil
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232239] to-[#204989] font-sans p-4">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Crear Cuenta</h2>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input para el nombre */}
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={name} // valor controlado por el estado
              onChange={(e) => setName(e.target.value)} // actualiza el estado al escribir
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          {/* Input para el email */}
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          {/* Input para la contraseña */}
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

          {/* Input para confirmar contraseña */}
          <div>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Botón para enviar el formulario */}
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Registrarse
          </button>
        </form>

        {/* Enlace a login para usuarios que ya tienen cuenta */}
        <p className="text-gray-500 text-sm mt-4">
          ¿Ya tienes cuenta?
          <Link to="/login" className="text-indigo-600 font-semibold ml-1 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
