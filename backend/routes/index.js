const express = require("express");
const router = express.Router();
const profesorRoutes = require("./profesorRoutes");
const partidaRoutes = require("./partidaRoutes");
const pictogramaRoutes = require("./pictogramaRoutes");

// Configuración de rutas con prefijos específicos
router.use("/profesores", profesorRoutes);
router.use("/partidas", partidaRoutes);
router.use("/pictogramas", pictogramaRoutes);

module.exports = router;
