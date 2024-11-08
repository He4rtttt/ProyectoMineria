// frontend/src/pages/Partida.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Registro from "../components/Alumno/Registro";
import Juego from "../components/Alumno/Juego";

function Partida() {
  const { partidaId } = useParams();
  const [alumnoRegistrado, setAlumnoRegistrado] = useState(false);
  const [alumnoId, setAlumnoId] = useState(null);
  const [pictogramas, setPictogramas] = useState([]);
  const [tiempoPorPictograma, setTiempoPorPictograma] = useState(0);

  const registrarAlumno = (id, { pictogramas, tiempoPorPictograma }) => {
    setAlumnoId(id);
    setPictogramas(pictogramas);
    setTiempoPorPictograma(tiempoPorPictograma);
    setAlumnoRegistrado(true);
  };

  return (
    <div>
      {alumnoRegistrado ? (
        <Juego partidaId={partidaId} alumnoId={alumnoId} pictogramas={pictogramas} tiempoPorPictograma={tiempoPorPictograma} />
      ) : (
        <Registro partidaId={partidaId} onRegistro={registrarAlumno} />
      )}
    </div>
  );
}

export default Partida;
