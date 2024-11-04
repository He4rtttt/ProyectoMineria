import React, { useState, useEffect } from "react";
import socket from "../../socket";

function Registro({ partidaId, onRegistro }) {
  const [nombre, setNombre] = useState("");

  const manejarRegistro = () => {
    socket.emit("registroAlumno", { partidaId, nombre });
  };

  useEffect(() => {
    const onRegistroExitoso = ({ alumnoId,pictogramas, tiempoPorPictograma }) => {
      console.log("Registro exitoso recibido en el frontend");
      // Usamos onRegistro para pasar el alumnoId y los datos necesarios
      onRegistro(alumnoId, { pictogramas, tiempoPorPictograma }); // Pasamos también pictogramas y tiempoPorPictograma
    };

    socket.on("registroExitoso", onRegistroExitoso);

    return () => socket.off("registroExitoso", onRegistroExitoso);
  }, [partidaId, onRegistro]);

  return (
    <div>
      <h2>Registro de Alumno</h2>
      <label>
        Nombre:
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </label>
      <button onClick={manejarRegistro}>Registrarse</button>
    </div>
  );
}

export default Registro;