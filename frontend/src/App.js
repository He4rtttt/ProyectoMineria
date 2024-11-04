import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import RegistroProfesor from './components/RegistroProfesor';
import Profesor from './components/Profesor';
import LoginEstudiante from './components/LoginEstudiante';
import Juego from './components/Juego';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <h1>Juego Educativo</h1>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<RegistroProfesor />} />
            <Route path="/crear-partida" element={<Profesor />} />
            <Route path="/login-estudiante/:partidaId" element={<LoginEstudiante />} />
            <Route path="/juego/:partidaId" element={<Juego />} />
            <Route path="/" element={<h2>Bienvenido, por favor inicie sesión.</h2>} />
          </Routes>
          <a href="/login">Iniciar Sesión</a>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
