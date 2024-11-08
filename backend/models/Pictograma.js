const mongoose = require('mongoose');

const arrayLimit = (val) => val.length <= 4;

const PictogramaSchema = new mongoose.Schema({
  nombreClase: { type: String, required: true },
  colors: {
    type: [String], // Arreglo de strings para los colores
    validate: {
      validator: arrayLimit,
      message: 'El campo {PATH} no puede tener más de 4 colores'
    }
  },
  numeroClase: { type: Number, required: true },
  simbolo: { type: String, required: true }
});

module.exports = mongoose.model('Pictograma', PictogramaSchema);

