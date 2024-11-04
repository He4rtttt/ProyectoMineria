// Importaciones necesarias
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // Para encriptar contraseñas
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

// Ruta para registrar un nuevo profesor
app.post("/api/profesores", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el email ya existe
    const emailExistente = await Profesor.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ error: "El email ya está en uso." });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoProfesor = await Profesor.create({ nombre, email, password: hashedPassword });
    
    res.status(201).json({ profesorId: nuevoProfesor._id });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el profesor" });
  }
});

// Manejo de conexiones WebSocket
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  // Inicio de sesión
  socket.on('iniciarSesion', async ({ email, contrasena }) => {
    try {
      const profesor = await Profesor.findOne({ email });

      if (!profesor) {
        socket.emit('sesionIniciada', { exito: false, mensaje: 'Profesor no encontrado.' });
        return;
      }

      const contrasenaValida = await bcrypt.compare(contrasena, profesor.password);

      if (contrasenaValida) {
        socket.emit('sesionIniciada', { exito: true, profesorId: profesor._id });
      } else {
        socket.emit('sesionIniciada', { exito: false, mensaje: 'Credenciales incorrectas.' });
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      socket.emit('sesionIniciada', { exito: false, mensaje: 'Error en el servidor.' });
    }
  });

  // Estado de la partida
  const juegos = {}; // Almacena el estado de cada partida por usuario

  socket.on("iniciarPartida", async ({ profesorId, tiempoPorPartida, tiempoPorCartel, totalPictogramas }) => {
    try {
      const partidaId = uuidv4();
      const linkPartida = `http://localhost:3000/login-estudiante/${partidaId}`;
  
      const nuevaPartida = new Partida({
        partidaId,
        profesor: profesorId,
        tiempoPorPartida: parseInt(tiempoPorPartida),
        tiempoPorCartel: parseInt(tiempoPorCartel),
        totalPictogramas: totalPictogramas, // Almacenar la cantidad de pictogramas
        estudiantes: [],
        estado: "activa",
      });
      await nuevaPartida.save();
  
      // Envía la configuración a todos los participantes
      socket.emit("configuracionPartida", {
        tiempoPorCartel,
        totalPictogramas, // Enviar al frontend
      });
  
      socket.emit("partidaIniciada", {
        mensaje: "Partida creada exitosamente.",
        link: linkPartida,
      });
    } catch (error) {
      console.error("Error al crear la partida:", error);
      socket.emit("error", { mensaje: "Error al crear la partida." });
    }
  });
  
  
  

  // Verificación de selección del estudiante
  socket.on("verificarSeleccion", async (data) => {
    console.log("Evento verificarSeleccion recibido:", data);
    const { colorSeleccionado, numeroSeleccionado, simboloSeleccionado, partidaId } = data;
    const colorNormalizado = colorSeleccionado.trim().toLowerCase();
    const simboloNormalizado = simboloSeleccionado.trim().toLowerCase();
    const numeroClase = parseInt(numeroSeleccionado, 10);
    
    const juego = juegos[partidaId]; // Obtener el juego actual

    try {
      const pictogramaCorrecto = await Pictograma.findOne({
        color: colorNormalizado,
        numeroClase,
        simbolo: simboloNormalizado,
      });

      // Emitir resultado de verificación
      socket.emit("resultadoVerificacion", {
        mensaje: pictogramaCorrecto
          ? "¡Correcto!"
          : "Incorrecto. Inténtalo de nuevo.",
      });

      // Cambiar al siguiente pictograma si hay más
      if (juego.intentoActual < juego.pictogramas.length - 1) {
        juego.intentoActual += 1; // Avanzar al siguiente intento
        // Emitir el pictograma actual
        socket.emit("pictogramaActual", juego.pictogramas[juego.intentoActual]);
      } else {
        socket.emit("resultadoFinal", { mensaje: "Partida finalizada. Gracias por jugar." });
        delete juegos[partidaId]; // Limpiar el estado del juego
      }
    } catch (error) {
      socket.emit("resultadoVerificacion", {
        mensaje: "Error al verificar la selección.",
      });
    }
  });

  // Procesa el login de estudiantes
  socket.on('loginEstudiante', async ({ nombre, partidaId }) => {
    const partida = await Partida.findOne({ partidaId });

    if (partida && partida.estado === 'activa') {
      partida.estudiantes.push(nombre);
      await partida.save();
      socket.emit('loginExitoso', { mensaje: 'Login exitoso' });
    } else {
      socket.emit('loginFallido', { mensaje: 'Código de acceso incorrecto o partida no encontrada.' });
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
        socket.emit("puntajeAlmacenado", {
          mensaje: "Puntaje almacenado correctamente",
        });
      } else {
        socket.emit("error", { mensaje: "Estudiante no encontrado" });
      }
    } catch (error) {
      socket.emit("error", { mensaje: "Error al almacenar puntaje" });
    }
  });
});

// Iniciar el servidor
server.listen(3001, () => {
  console.log("Servidor escuchando en el puerto 3001");
});
