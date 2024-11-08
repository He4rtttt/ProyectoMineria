// frontend/src/pages/Profesor.js
import React, { useState } from "react";
import Login from "../components/Profesor/Login";
import CrearPartida from "../components/Profesor/CrearPartida";

function Profesor() {
  const [profesorId, setProfesorId] = useState(null);



  return (
    <div>
      <h2>Panel del Profesor</h2>
      {!profesorId ? (
        <Login setProfesorId={setProfesorId} />
      ) : (
        <>
          <CrearPartida profesorId={profesorId} />
        </>
      )}
    </div>
  );
}