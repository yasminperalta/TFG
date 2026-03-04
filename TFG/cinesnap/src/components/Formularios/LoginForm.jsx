// Import Link (para navegar sin recargar) y
// useNavigate (para redirecciones programáticas) de React Router
// Import estilos específicos para el formulario de autenticación
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/useAuth";
import "./AuthForm.css";

export default function LoginForm() {
  // Estado local para almacenar los datos ingresados
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene que la página se recargue
    if (!email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }
    alert("Inicio de sesión exitoso"); // Muestra un mensaje (temporal, solo ejemplo)
    login(email); // guarda el usuario en el contexto
    navigate("/profile"); // redirige después de login
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Input para correo electrónico */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email} // valor controlado por el estado
            onChange={(e) => setEmail(e.target.value)} // actualiza el estado al escribir
            required
          />

          {/* Input para contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Botón para enviar el formulario */}
          <button type="submit">Iniciar Sesión</button>
        </form>

         {/* Texto con enlace para ir a registro */}
        <p className="toggle-text">
          ¿No tienes cuenta?
          <Link to="/register"> Regístrate</Link>
        </p>
      </div>
    </div>
  );
}