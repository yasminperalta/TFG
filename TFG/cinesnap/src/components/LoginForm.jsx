import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/useAuth";
import "./AuthForm.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Inicio de sesión exitoso");
    login(email,password);// guarda el usuario en el contexto
    navigate("/profile"); // redirige después de login
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Iniciar Sesión</button>
        </form>

        <p className="toggle-text">
          ¿No tienes cuenta?
          <Link to="/register"> Regístrate</Link>
        </p>
      </div>
    </div>
  );
}