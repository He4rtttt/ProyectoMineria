const mongoose = require("mongoose");

const PartidaSchema = new mongoose.Schema({
  partidaId: String,
  profesor: { type: mongoose.Schema.Types.ObjectId, ref: "Profesor" },
  tiempoPorPictograma: Number,
  numeroDePictogramas: Number,
  estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Estudiante" }],
  estado: { type: String, default: "activa" },
});

module.exports = mongoose.model("Partida", PartidaSchema);