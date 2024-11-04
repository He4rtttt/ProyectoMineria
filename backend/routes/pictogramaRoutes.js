// backend/routes/pictogramaRoutes.js
const express = require("express");
const { obtenerPictogramasAleatorios } = require("../controllers/pictogramaController");
const router = express.Router();

router.get("/api/pictogramas/:cantidad", obtenerPictogramasAleatorios);

module.exports = router;
