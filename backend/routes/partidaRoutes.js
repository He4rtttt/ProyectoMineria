// routes/partidaRoutes.js
const express = require("express");
const { crearPartida } = require("../controllers/partidaController");
const router = express.Router();

router.post("/api/partidas", crearPartida);

module.exports = router;
