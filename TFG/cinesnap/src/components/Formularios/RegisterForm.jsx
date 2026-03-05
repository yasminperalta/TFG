import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForm.css";

// Componente de registro de usuarios
export default function Register() {
  // Estados locales para guardar la información del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Hook de React Router para redirigir al usuario
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // evita que la página se recargue

    // Verifica que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return; // detiene la ejecución si no coinciden
    }

    // Mensaje de éxito (solo ejemplo)
    alert("Registro exitoso");

    // Limpia los campos del formulario
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    navigate("/login"); // después de registrarse redirige al login
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear Cuenta</h2>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit}>
          {/* Input para el nombre */}
          <input
            type="text"
            placeholder="Nombre"
            value={name} // valor controlado por el estado
            onChange={(e) => setName(e.target.value)} // actualiza el estado al escribir
            required
          />
          {/* Input para el email */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Input para la contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Input para confirmar contraseña */}
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Botón para enviar el formulario */}
          <button type="submit">Registrarse</button>
        </form>

        {/* Enlace a login para usuarios que ya tienen cuenta */}
        <p className="toggle-text">
          ¿Ya tienes cuenta?
          <Link to="/login"> Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
