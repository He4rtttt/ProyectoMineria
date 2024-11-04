// backend/controllers/pictogramaController.js
const Pictograma = require("../models/Pictograma");

exports.obtenerPictogramasAleatorios = async (req, res) => {
  const { cantidad } = req.params; // Cantidad de pictogramas solicitados

  try {
    const pictogramas = await Pictograma.aggregate([{ $sample: { size: parseInt(cantidad) } }]);
    res.status(200).json(pictogramas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener pictogramas aleatorios" });
  }
};
