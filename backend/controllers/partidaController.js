const Partida = require("../models/Partida");
const { v4: uuidv4 } = require("uuid");

exports.crearPartida = async (req, res) => {
  const { profesorId, tiempoPorPictograma, numeroDePictogramas } = req.body;
  try {
    const partida = new Partida({
      partidaId: uuidv4(),
      profesor: profesorId,
      tiempoPorPictograma,
      numeroDePictogramas,
    });
    await partida.save();
    res.status(201).json({ partidaId: partida.partidaId });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la partida" });
  }
};
