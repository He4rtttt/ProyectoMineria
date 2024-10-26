// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); // Para generar IDs únicos

const Pictograma = require("./models/Pictograma");
const Profesor = require("./models/Profesor");
const Estudiante = require("./models/Estudiante");
const Partida = require("./models/Partida");

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/juego", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.log("Error al conectar a MongoDB:", err));

// Endpoint para obtener todos los pictogramas
app.get("/api/pictogramas", async (req, res) => {
  try {
    const pictogramas = await Pictograma.find();
    res.json(pictogramas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener pictogramas" });
  }
});

// Manejo de conexiones WebSocket
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  // Verificación de selección del estudiante
  socket.on("verificarSeleccion", async (data) => {
    const { colorSeleccionado, numeroSeleccionado, simboloSeleccionado } = data;
    const colorNormalizado = colorSeleccionado.trim().toLowerCase();
    const simboloNormalizado = simboloSeleccionado.trim().toLowerCase();
    const numeroClase = parseInt(numeroSeleccionado, 10);

    try {
      const pictogramaCorrecto = await Pictograma.findOne({
        color: colorNormalizado,
        numeroClase,
        simbolo: simboloNormalizado,
      });

      socket.emit("resultadoVerificacion", {
        mensaje: pictogramaCorrecto ? "¡Correcto!" : "Incorrecto. Inténtalo de nuevo.",
      });
    } catch (error) {
      socket.emit("resultadoVerificacion", { mensaje: "Error al verificar la selección." });
    }
  });

  // Iniciar una nueva partida
  socket.on("iniciarPartida", async ({ profesorId, tiempoPorPartida, tiempoPorCartel }) => {
    try {
      // Genera un ID único para la partida y crea el link
      const partidaId = uuidv4();
      const linkPartida = `http://localhost:3000/partida/${partidaId}`;

      // Guarda la partida en la base de datos
      const nuevaPartida = new Partida({
        partidaId,
        profesor: profesorId,
        tiempoPorPartida,
        tiempoPorCartel,
        estudiantes: [],
        estado: "activa",
      });
      await nuevaPartida.save();

      // Envía el link al frontend
      socket.emit("partidaIniciada", { mensaje: "Partida creada exitosamente.", link: linkPartida });
    } catch (error) {
      console.error("Error al crear la partida:", error);
      socket.emit("error", { mensaje: "Error al crear la partida." });
    }
  });

  // Almacenar puntaje del estudiante
  socket.on("almacenarPuntaje", async (data) => {
    const { estudianteId, partidaId, puntaje } = data;
    try {
      const estudiante = await Estudiante.findById(estudianteId);
      if (estudiante) {
        estudiante.puntajes.push({ partida: partidaId, puntaje });
        await estudiante.save();
        socket.emit("puntajeAlmacenado", { mensaje: "Puntaje almacenado correctamente" });
      } else {
        socket.emit("error", { mensaje: "Estudiante no encontrado" });
      }
    } catch (error) {
      socket.emit("error", { mensaje: "Error al almacenar puntaje" });
    }
  });
});


// Endpoint para crear un profesor
app.post("/api/profesores", async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const profesor = new Profesor({ nombre, email, password });
    await profesor.save();
    res.status(201).json({ profesorId: profesor._id });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar el profesor" });
  }
});
// Iniciar el servidor
server.listen(3001, () => {
  console.log("Servidor escuchando en el puerto 3001");
});
