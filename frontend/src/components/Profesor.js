// Profesor.js
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:3001");

const Profesor = () => {
  const location = useLocation();
  const profesorId = location.state?.profesorId || "12345"; // Usa el ID proporcionado o uno predeterminado
  const [tiempoPorPartida, setTiempoPorPartida] = useState(60);
  const [tiempoPorCartel, setTiempoPorCartel] = useState(10);
  const [linkPartida, setLinkPartida] = useState("");
  const [mensaje, setMensaje] = useState("");

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
    socket.emit("iniciarPartida", { profesorId, tiempoPorPartida, tiempoPorCartel });
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
      <button onClick={iniciarPartida}>Iniciar Partida</button>

      {mensaje && <p>{mensaje}</p>}
      {linkPartida && (
        <p>
          Link para unirse a la partida: <a href={linkPartida}>{linkPartida}</a>
        </p>
      )}
    </div>
  );
};

export default Profesor;
