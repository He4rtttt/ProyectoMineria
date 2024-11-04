const Profesor = require("../models/Profesor");

exports.registrarProfesor = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const profesor = new Profesor({ nombre, email, password });
    await profesor.save();
    res.status(201).json({ profesorId: profesor._id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar el profesor" });
  }
};
