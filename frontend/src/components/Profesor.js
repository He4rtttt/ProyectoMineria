import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext'; // Importar el contexto de autenticación

const socket = io("http://localhost:3001");

const Profesor = () => {
  const { usuario } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const profesorId = location.state?.profesorId;
  const [tiempoPorPartida, setTiempoPorPartida] = useState(120);
  const [tiempoPorCartel, setTiempoPorCartel] = useState(60);
  const [totalPictogramas, setCantidadPictogramas] = useState(2); // Nuevo estado para la cantidad de pictogramas
  const [linkPartida, setLinkPartida] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!usuario) {
      navigate('/login'); // Usar navigate para redirigir
    }
  }, [usuario, profesorId, navigate]);

  useEffect(() => {
    socket.on("partidaIniciada", (data) => {
      setMensaje(data.mensaje);
      setLinkPartida(data.link);
    });

    socket.on("error", (error) => {
      setMensaje(error.mensaje);
    });

    return () => {
      socket.off("partidaIniciada");
      socket.off("error");
    };
  }, []);

  const iniciarPartida = () => {
    socket.emit("iniciarPartida", {
      profesorId,
      tiempoPorPartida,
      tiempoPorCartel,
      totalPictogramas, // Enviar la cantidad de pictogramas al backend
    });
  };

  return (
    <div>
      <h1>Crear Nueva Partida</h1>
      <label>
        Tiempo por Partida (segundos):
        <input
          type="number"
          value={tiempoPorPartida}
          onChange={(e) => setTiempoPorPartida(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Tiempo por Cartel (segundos):
        <input
          type="number"
          value={tiempoPorCartel}
          onChange={(e) => setTiempoPorCartel(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Cantidad de Pictogramas:
        <input
          type="number"
          value={totalPictogramas}
          onChange={(e) => setCantidadPictogramas(Number(e.target.value))}
        />
      </label>
      <br />
      <button onClick={iniciarPartida}>Iniciar Partida</button>
      {mensaje && <p>{mensaje}</p>}
      {linkPartida && (
        <div>
          <p>Link de la partida: <a href={linkPartida}>{linkPartida}</a></p>
        </div>
      )}
    </div>
  );
};

export default Profesor;
