import React, { useState } from 'react';
import socket from '../socket';

function Juego() {
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  const [numeroSeleccionado, setNumeroSeleccionado] = useState('');
  const [simboloSeleccionado, setSimboloSeleccionado] = useState('');


  console.log('Valores a enviar:', {
    colorSeleccionado: colorSeleccionado,
    numeroSeleccionado: numeroSeleccionado,
    simboloSeleccionado: simboloSeleccionado
  });
  
  const verificarSeleccion = () => {
    socket.emit('verificarSeleccion', {
      colorSeleccionado,
      numeroSeleccionado,
      simboloSeleccionado
    });
  };

  return (
    <div>
      <h2>Adivina el Pictograma</h2>
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
    </div>
  );
}

export default Juego;
