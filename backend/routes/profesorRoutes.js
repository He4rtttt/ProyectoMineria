const express = require("express");
const { registrarProfesor, login } = require("../controllers/profesorController");
const router = express.Router();

router.post("/", registrarProfesor);         // POST /api/profesores
router.post("/login", login);                // POST /api/profesores/login

module.exports = router;

