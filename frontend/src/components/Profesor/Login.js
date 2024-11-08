// frontend/src/components/Profesor/Login.js
import React, { useState } from "react";
import axios from "axios";

function Login({ setProfesorId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/profesor/login", { email, password });
      setProfesorId(data.profesorId); // Guarda el ID del profesor en el estado principal
    } catch (error) {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
}

export default Login;