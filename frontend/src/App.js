// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistroProfesor from './components/RegistroProfesor';
import Profesor from './components/Profesor';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RegistroProfesor />} />
          <Route path="/crear-partida" element={<Profesor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

























// import React, { useState, useEffect } from 'react';
// import socket from './socket';
// import Juego from './components/Juego';

// function App() {
//   const [resultado, setResultado] = useState('');

//   useEffect(() => {
//     // Escuchar el resultado de la verificación desde el backend
//     socket.on('resultadoVerificacion', (data) => {
//       setResultado(data.mensaje);
//     });

//     return () => {
//       socket.off('resultadoVerificacion');
//     };
//   }, []);

//   return (
//     <div className="App">
//       <h1>Juego Educativo</h1>
//       <Juego />
//       <p>{resultado}</p>
//     </div>
//   );
// }

// export default App;
