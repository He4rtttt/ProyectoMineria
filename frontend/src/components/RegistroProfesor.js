// RegistroProfesor.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegistroProfesor = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const registrarProfesor = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/profesores', {
        nombre,
        email,
        password,
      });
      
      if (response.status === 201) {
        // Redirigir a la vista de creación de partida con el ID del profesor
        navigate('/crear-partida', { state: { profesorId: response.data.profesorId } });
      }
    } catch (error) {
      console.error('Error al registrar el profesor:', error);
    }
  };

  return (
    <div>
      <h1>Registro de Profesor</h1>
      <form onSubmit={registrarProfesor}>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegistroProfesor;
