// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profesor from "./pages/Profesor";
import Partida from "./pages/Partida";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profesor" element={<Profesor />} />
        <Route path="/partida/:partidaId" element={<Partida />} />
      </Routes>
    </Router>
  );
}

export default App;
