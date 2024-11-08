const mongoose = require("mongoose");

const ProfesorSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("Profesor", ProfesorSchema);
