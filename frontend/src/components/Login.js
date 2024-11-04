import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Importa el contexto

const Login = () => {
  const [emailInput, setEmailInput] = useState('');
  const [contrasenaInput, setContrasenaInput] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth(); // Obtén la función para iniciar sesión

  useEffect(() => {
    socket.on('sesionIniciada', (data) => {
      if (data.exito) {
        console.log('Inicio de sesión exitoso. ID del profesor:', data.profesorId);
        iniciarSesion(data.profesorId); // Guarda el ID del profesor en el contexto
        navigate('/crear-partida', { state: { profesorId: data.profesorId } });
      } else {
        setMensaje(data.mensaje);
      }
    });

    return () => {
      socket.off('sesionIniciada');
    };
  }, [navigate, iniciarSesion]);

  const manejarInicioSesion = () => {
    socket.emit('iniciarSesion', { email: emailInput, contrasena: contrasenaInput });
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <label>
        Correo Electrónico:
        <input
          type="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
      </label>
      <br />
      <label>
        Contraseña:
        <input
          type="password"
          value={contrasenaInput}
          onChange={(e) => setContrasenaInput(e.target.value)}
        />
      </label>
      <br />
      <button onClick={manejarInicioSesion}>Iniciar Sesión</button>
      {mensaje && <p>{mensaje}</p>}
      <p>¿No tienes cuenta? <button onClick={() => navigate('/registrar')}>Regístrate aquí</button></p>
    </div>
  );
};

export default Login;
