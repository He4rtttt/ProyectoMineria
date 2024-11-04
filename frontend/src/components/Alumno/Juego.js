import React, { useEffect, useState } from "react";
import socket from "../../socket";

function Juego({ partidaId, alumnoId, pictogramas, tiempoPorPictograma }) {
  const tiempoTotal = pictogramas.length * tiempoPorPictograma;
  const [tiempoRestanteTotal, setTiempoRestanteTotal] = useState(tiempoTotal);
  const [tiempoRestantePictograma, setTiempoRestantePictograma] = useState(tiempoPorPictograma);
  const [pictogramaActual, setPictogramaActual] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [respuesta, setRespuesta] = useState({ color: "", numeroClase: "", simbolo: "" });
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  // Efecto para manejar el temporizador total
  useEffect(() => {
    if (juegoTerminado) return;

    const timerTotal = setInterval(() => {
      setTiempoRestanteTotal((prev) => {
        if (prev <= 1) {
          setJuegoTerminado(true); // Termina el juego cuando el tiempo total se agote
          clearInterval(timerTotal);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerTotal);
  }, [juegoTerminado]);

  // Efecto para manejar el temporizador por pictograma
  useEffect(() => {
    if (juegoTerminado) return;

    const timerPictograma = setInterval(() => {
      setTiempoRestantePictograma((prev) => {
        if (prev <= 1) {
          clearInterval(timerPictograma); // Detiene el temporizador del pictograma
          verificarRespuesta(); // Verifica la respuesta cuando el tiempo del pictograma se agota
          return tiempoPorPictograma;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerPictograma);
  }, [pictogramaActual, juegoTerminado, tiempoPorPictograma]);

  // Función para verificar la respuesta manualmente
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

      // Avanzar al siguiente pictograma o terminar el juego si no hay más
      if (pictogramaActual + 1 < pictogramas.length) {
        setPictogramaActual((prev) => prev + 1);
        setRespuesta({ color: "", numeroClase: "", simbolo: "" });
        setTiempoRestantePictograma(tiempoPorPictograma);
      } else {
        setJuegoTerminado(true); // Termina el juego cuando no hay más pictogramas
      }
    });
  };

  if (juegoTerminado) {
    const tiempoUsado = tiempoTotal - tiempoRestanteTotal;
    return <div>Puntuación final: {puntaje}. Tiempo total utilizado: {tiempoUsado} segundos.</div>;
  }

  const pictograma = pictogramas[pictogramaActual] || {};

  return (
    <div>
      <h2>Tiempo total restante: {tiempoRestanteTotal}</h2>
      <h2>Tiempo restante para este pictograma: {tiempoRestantePictograma}</h2>
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