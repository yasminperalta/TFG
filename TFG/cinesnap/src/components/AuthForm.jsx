import React, { useState } from "react";
import "./AuthForm.css";

export default function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegistering && password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (isRegistering) {
      alert("Registro exitoso");
    } else {
      alert("Inicio de sesión exitoso");
    }

    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}</h2>

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

          {isRegistering && (
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button type="submit">
            {isRegistering ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>

        <p className="toggle-text">
          {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
          <span onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? " Inicia sesión" : " Regístrate"}
          </span>
        </p>
      </div>
    </div>
  );
}