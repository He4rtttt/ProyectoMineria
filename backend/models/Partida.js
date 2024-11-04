const mongoose = require('mongoose');

const partidaSchema = new mongoose.Schema({
  partidaId: { type: String, required: true },
  profesor: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor', required: true },
  tiempoPorPartida: { type: Number, required: true },
  tiempoPorCartel: { type: Number, required: true },
  estudiantes: [{ type: String }], // Puedes modificarlo para almacenar más datos de cada estudiante
  estado: { type: String, enum: ['activa', 'finalizada'], default: 'activa' },
});

module.exports = mongoose.model('Partida', partidaSchema);
