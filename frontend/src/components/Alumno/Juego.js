import React, { useEffect, useState } from "react";
import socket from "../../socket";

function Juego({ partidaId, alumnoId, pictogramas, tiempoPorPictograma }) {
  const [pictogramaActual, setPictogramaActual] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [respuesta, setRespuesta] = useState({ color: "", numeroClase: "", simbolo: "" });
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  useEffect(() => {
    setTiempoRestante(pictogramas.length * tiempoPorPictograma);

    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          setJuegoTerminado(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [partidaId, pictogramas, tiempoPorPictograma]);

  const verificarRespuesta = () => {
    if (juegoTerminado) return;

    socket.emit("verificarSeleccion", { partidaId, alumnoId, respuesta });
    socket.once("respuestaVerificada", ({ esCorrecto, respuestaCorrecta }) => {
      if (esCorrecto) {
        alert("¡Correcto!");
        setPuntaje((prev) => prev + 1);
      } else {
        alert(`Incorrecto. Respuesta correcta: Color: ${respuestaCorrecta.color}, Número de Clase: ${respuestaCorrecta.numeroClase}, Símbolo: ${respuestaCorrecta.simbolo}`);
      }

      if (pictogramaActual + 1 < pictogramas.length) {
        setPictogramaActual((prev) => prev + 1);
        setRespuesta({ color: "", numeroClase: "", simbolo: "" });
        setTiempoRestante(tiempoPorPictograma);
      } else {
        setJuegoTerminado(true);
      }
    });
  };

  if (juegoTerminado) {
    return <div>Puntuación final: {puntaje}</div>;
  }

  const pictograma = pictogramas[pictogramaActual] || {};

  return (
    <div>
      <h2>Tiempo restante: {tiempoRestante}</h2>
      <h3>Pictograma: {pictograma.nombreClase}</h3>
      <label>
        Color:
        <input type="text" value={respuesta.color} onChange={(e) => setRespuesta({ ...respuesta, color: e.target.value })} />
      </label>
      <label>
        Número de Clase:
        <input type="number" value={respuesta.numeroClase} onChange={(e) => setRespuesta({ ...respuesta, numeroClase: e.target.value })} />
      </label>
      <label>
        Símbolo:
        <input type="text" value={respuesta.simbolo} onChange={(e) => setRespuesta({ ...respuesta, simbolo: e.target.value })} />
      </label>
      <button onClick={verificarRespuesta}>Verificar</button>
    </div>
  );
}

export default Juego;
