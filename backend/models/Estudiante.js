const mongoose = require("mongoose");

const EstudianteSchema = new mongoose.Schema({
  nombre: String,
  partida: { type: mongoose.Schema.Types.ObjectId, ref: "Partida" },
  puntaje: Number,
  indice: { type: Number, default: 0 },
  pictogramas: [{ type:  mongoose.Schema.Types.ObjectId, ref: "Pictograma" }]
});

module.exports = mongoose.model("Estudiante", EstudianteSchema);
