// frontend/src/components/Profesor/CrearPartida.js
import React, { useState } from "react";
import socket from "../../socket";

function CrearPartida() {
  const [tiempoPorPictograma, setTiempoPorPictograma] = useState(30);
  const [numeroDePictogramas, setNumeroDePictogramas] = useState(5);
  const [linkPartida, setLinkPartida] = useState(null);

  const manejarCrearPartida = () => {
    const profesorId = "6728dcdeec5efb67b97607fc"; // ID temporal para pruebas

    socket.emit("iniciarPartida", { profesorId, tiempoPorPictograma, numeroDePictogramas });

    socket.on("partidaIniciada", ({ mensaje, link }) => {
      setLinkPartida(link);
      alert(mensaje);
    });

    socket.on("error", ({ mensaje }) => {
      console.error("Error en CrearPartida:", mensaje);
      alert(mensaje); 
    });
  };

  return (
    <div>
      <h2>Crear Partida</h2>
      <label>
        Tiempo por Pictograma (segundos):
        <input type="number" value={tiempoPorPictograma} onChange={(e) => setTiempoPorPictograma(e.target.value)} />
      </label>
      <label>
        Número de Pictogramas:
        <input type="number" value={numeroDePictogramas} onChange={(e) => setNumeroDePictogramas(e.target.value)} />
      </label>
      <button onClick={manejarCrearPartida}>Iniciar Partida</button>
      {linkPartida && (
        <div>
          <h3>Enlace para alumnos:</h3>
          <p>{linkPartida}</p>
        </div>
      )}
    </div>
  );
}

export default CrearPartida;
