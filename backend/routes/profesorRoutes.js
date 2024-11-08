// routes/profesorRoutes.js
const express = require("express");
const { registrarProfesor, login} = require("../controllers/profesorController");
const router = express.Router();

router.post("/api/profesores", registrarProfesor);
router.post("/api/profesores/login", login);


module.exports = router;
