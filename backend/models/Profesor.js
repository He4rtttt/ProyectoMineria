const mongoose = require('mongoose');

const ProfesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Añadir el campo de contraseña
});

module.exports = mongoose.model('Profesor', ProfesorSchema);
