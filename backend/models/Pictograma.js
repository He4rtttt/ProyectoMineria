// models/Pictograma.js
const mongoose = require('mongoose');

const PictogramaSchema = new mongoose.Schema({
  nombreClase: String,
  color: String,
  numeroClase: Number,
  simbolo: String,
});

module.exports = mongoose.model('Pictograma', PictogramaSchema);