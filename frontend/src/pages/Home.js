// frontend/src/pages/Home.js
import React, {useState} from "react";
import { Link, useNavigate  } from "react-router-dom";
import socket from '../socket';
function Home() {
  const [codigo, setCodigo] = useState("");

  const navigate = useNavigate();
  const validarCodigo= () => {
    socket.emit("validarCodigo", codigo);

    socket.on("resultado", async (respuesta) => {
     
        if (respuesta) {
          navigate (`partida/${codigo}`)
          return
        
        }
        else {
          alert('Código incorrecto. Por favor, inténtalo de nuevo.');
        }
     
    });
  };
  return (
    <div>
      <h1>Bienvenido al Sistema de Pictogramas</h1>
      <Link to="/profesor">Iniciar como Profesor</Link>
      <br/>
      <h1>Introducer tu codigo</h1>
        <input
          
         type = 'text'
          value={codigo}  // Vincula el input al estado 'codigo'
          onChange={(e) => setCodigo(e.target.value)}  // Actualiza el estado 'codigo' cuando el usuario escriba 
        />
      <button onClick={validarCodigo}>Iniciar Sesión</button>


    </div>
  );
}

export default Home;
