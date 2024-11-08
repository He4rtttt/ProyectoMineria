import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket';

const LoginEstudiante = () => {
  const [nombre, setNombre] = useState('');
  const { partidaId } = useParams(); // Cambia a partidaId
  const navigate = useNavigate();

  const manejarLogin = () => {
    socket.emit('loginEstudiante', { nombre, partidaId });
  };

  useEffect(() => {
    socket.on('loginExitoso', () => {
      navigate(`/juego/${partidaId}`); // Redirigir al juego si el login es exitoso
    });

    socket.on('loginFallido', (mensaje) => {
      alert(mensaje);
    });

    return () => {
      socket.off('loginExitoso');
      socket.off('loginFallido');
    };
  }, [navigate, partidaId]);

  return (
    <div>
      <h2>Login Estudiante</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button onClick={manejarLogin}>Unirse a la Partida</button>
    </div>
  );
};

export default LoginEstudiante;
