// frontend/src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Bienvenido al Sistema de Pictogramas</h1>
      <Link to="/profesor">Iniciar como Profesor</Link>
      <br />
      <Link to="/alumno">Iniciar como Alumno</Link>
    </div>
  );
}

export default Home;
