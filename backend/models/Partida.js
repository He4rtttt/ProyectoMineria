// models/Partida.js
const mongoose = require('mongoose');

const PartidaSchema = new mongoose.Schema({
  partidaId: String,
  profesorId: String,
  tiempoPorPartida: Number,
  tiempoPorCartel: Number,
  estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante' }],
  estado: String, // Activa, Finalizada, etc.
  fechaCreacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Partida', PartidaSchema);
