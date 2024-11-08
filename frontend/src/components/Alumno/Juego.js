import React, { useEffect, useState, useCallback } from "react";
import socket from "../../socket";

function Juego({ partidaId, alumnoId, pictogramas, tiempoPorPictograma }) {
  const tiempoTotal = pictogramas.length * tiempoPorPictograma;
  const [tiempoRestanteTotal, setTiempoRestanteTotal] = useState(tiempoTotal);
  const [tiempoRestantePictograma, setTiempoRestantePictograma] = useState(tiempoPorPictograma);
  const [pictogramaActual, setPictogramaActual] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [respuesta, setRespuesta] = useState({ color: "", numeroClase: "", simbolo: "" });
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);
  const [contadorBloqueo, setContadorBloqueo] = useState(3);

  // Función para verificar la respuesta actual y mostrar la ventana emergente
  const verificarRespuesta = useCallback(() => {
    if (juegoTerminado) return;

    socket.emit("verificarSeleccion", { partidaId, alumnoId, respuesta });
    socket.once("respuestaVerificada", ({ esCorrecto, respuestaCorrecta }) => {
      if (esCorrecto) {
        setPuntaje((prev) => prev + 1);
      }
      setRespuestaCorrecta(respuestaCorrecta); // Muestra la respuesta correcta
      setMostrarRespuesta(true); // Activa el modal de respuesta
    });
  }, [juegoTerminado, partidaId, alumnoId, respuesta]);

  // Temporizador total que termina el juego
  useEffect(() => {
    if (juegoTerminado) return;

    const timerTotal = setInterval(() => {
      setTiempoRestanteTotal((prev) => {
        if (prev <= 1) {
          clearInterval(timerTotal);
          setJuegoTerminado(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerTotal);
  }, [juegoTerminado]);

  // Temporizador por pictograma
  useEffect(() => {
    if (juegoTerminado || mostrarRespuesta) return;

    const timerPictograma = setInterval(() => {
      setTiempoRestantePictograma((prev) => {
        if (prev <= 1) {
          clearInterval(timerPictograma);
          verificarRespuesta(); // Verifica la respuesta cuando se agota el tiempo
          return tiempoPorPictograma;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerPictograma);
  }, [pictogramaActual, juegoTerminado, mostrarRespuesta, verificarRespuesta, tiempoPorPictograma]);

  // Cuenta regresiva de bloqueo después de mostrar la respuesta correcta
  useEffect(() => {
    if (!mostrarRespuesta) return;

    const countdown = setInterval(() => {
      setContadorBloqueo((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setMostrarRespuesta(false);
          setContadorBloqueo(3); // Resetea el contador de bloqueo
          if (pictogramaActual + 1 < pictogramas.length) {
            setPictogramaActual((prev) => prev + 1);
            setRespuesta({ color: "", numeroClase: "", simbolo: "" });
            setTiempoRestantePictograma(tiempoPorPictograma);
          } else {
            setJuegoTerminado(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [mostrarRespuesta, pictogramaActual, pictogramas.length, tiempoPorPictograma]);

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
        <input
          type="text"
          value={respuesta.color}
          onChange={(e) => setRespuesta({ ...respuesta, color: e.target.value })}
          disabled={mostrarRespuesta}
        />
      </label>
      <label>
        Número de Clase:
        <input
          type="number"
          value={respuesta.numeroClase}
          onChange={(e) => setRespuesta({ ...respuesta, numeroClase: e.target.value })}
          disabled={mostrarRespuesta}
        />
      </label>
      <label>
        Símbolo:
        <input
          type="text"
          value={respuesta.simbolo}
          onChange={(e) => setRespuesta({ ...respuesta, simbolo: e.target.value })}
          disabled={mostrarRespuesta}
        />
      </label>
      <button onClick={verificarRespuesta} disabled={mostrarRespuesta}>Verificar</button>

      {/* Ventana emergente que muestra la respuesta correcta */}
      {mostrarRespuesta && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)"
        }}>
          <h3>Respuesta Correcta</h3>
          <p>Color: {respuestaCorrecta.color}</p>
          <p>Número de Clase: {respuestaCorrecta.numeroClase}</p>
          <p>Símbolo: {respuestaCorrecta.simbolo}</p>
          <p>Cambiando al siguiente en {contadorBloqueo}...</p>
        </div>
      )}
    </div>
  );
}

export default Juego;