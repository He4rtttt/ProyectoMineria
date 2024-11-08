// routes/profesorRoutes.js
const express = require("express");
const { registrarProfesor } = require("../controllers/profesorController");
const router = express.Router();

router.post("/api/profesores", registrarProfesor);

module.exports = router;
