import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function Juego() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  const [numeroSeleccionado, setNumeroSeleccionado] = useState('');
  const [simboloSeleccionado, setSimboloSeleccionado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [pictogramaActual, setPictogramaActual] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [intento, setIntento] = useState(0);
  const [totalPictogramas, setTotalPictogramas] = useState(0); // Añadir estado para total de pictogramas
  const [tiempoPorCartel, setTiempoPorCartel] = useState(30); // Tiempo por cartel por defecto

  useEffect(() => {
    socket.on("resultadoVerificacion", (data) => {
      setMensaje(data.mensaje);
      // Pasar al siguiente pictograma después de la verificación
      if (intento < totalPictogramas - 1) {
        setIntento(intento + 1);
      } else {
        finalizarPartida();
      }
    });

    socket.on("pictogramaActual", (data) => {
      setPictogramaActual(data);
      setTiempoRestante(tiempoPorCartel); // Reinicia el temporizador con el tiempo por cartel
    });

    socket.on("configuracionPartida", ({ tiempoPorCartel, totalPictogramas }) => {
      setTiempoPorCartel(tiempoPorCartel); // Configura el tiempo por cartel desde el servidor
      setTotalPictogramas(totalPictogramas); // Configura el total de pictogramas
      setTiempoRestante(tiempoPorCartel); // Reinicia el tiempo al recibir la configuración
    });

    return () => {
      socket.off("resultadoVerificacion");
      socket.off("pictogramaActual");
      socket.off("configuracionPartida");
    };
  }, [intento, totalPictogramas]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (tiempoRestante > 0) {
        setTiempoRestante(tiempoRestante - 1);
      } else if (tiempoRestante === 0) {
        setMensaje("Tiempo agotado. Pasando al siguiente pictograma...");
        socket.emit("verificarSeleccion", {
          colorSeleccionado: '',
          numeroSeleccionado: '',
          simboloSeleccionado: '',
        }); // Marca la respuesta como incorrecta
        setIntento(intento + 1); // Pasa al siguiente pictograma
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tiempoRestante, intento]);

  const verificarSeleccion = () => {
    socket.emit("verificarSeleccion", {
      colorSeleccionado,
      numeroSeleccionado,
      simboloSeleccionado,
    });
  };

  const finalizarPartida = () => {
    setMensaje("Partida finalizada. Gracias por jugar.");
    navigate('/resultados'); // Redirige a la pantalla de resultados o termina el juego
  };

  return (
    <div>
      <h2>Adivina el Pictograma</h2>
      <p>Tiempo restante: {tiempoRestante} segundos</p>
      <label>Color:</label>
      <input
        type="text"
        value={colorSeleccionado}
        onChange={(e) => setColorSeleccionado(e.target.value)}
      />
      <br />
      <label>Número:</label>
      <input
        type="number"
        value={numeroSeleccionado}
        onChange={(e) => setNumeroSeleccionado(e.target.value)}
      />
      <br />
      <label>Símbolo:</label>
      <input
        type="text"
        value={simboloSeleccionado}
        onChange={(e) => setSimboloSeleccionado(e.target.value)}
      />
      <br />
      <button onClick={verificarSeleccion}>Verificar Selección</button>
      <p>{mensaje}</p>
    </div>
  );
}

export default Juego;
