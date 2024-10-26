const mongoose = require('mongoose');

const EstudianteSchema = new mongoose.Schema({
  nombre: String,
  puntajes: [{
    partida: { type: mongoose.Schema.Types.ObjectId, ref: 'Partida' },
    puntaje: Number
  }]
});

module.exports = mongoose.model('Estudiante', EstudianteSchema);
