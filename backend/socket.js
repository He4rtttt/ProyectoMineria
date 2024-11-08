// backend/socket.js
const Partida = require("./models/Partida");
const Estudiante = require("./models/Estudiante");
const Pictograma = require("./models/Pictograma");
const mongoose = require("mongoose");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("crearPartida", async ({ profesorId, tiempoPorPictograma, numeroDePictogramas }) => {
      try {
        console.log("Iniciando partida con profesorId:", profesorId, "tiempoPorPictograma:", tiempoPorPictograma, "numeroDePictogramas:", numeroDePictogramas);
        
        // Asegurarse de que numeroDePictogramas es un entero
        const numeroDePictogramasInt = parseInt(numeroDePictogramas, 10);
    
        const pictogramas = await Pictograma.aggregate([{ $sample: { size: numeroDePictogramasInt } }]);
    
        const partida = new Partida({
          partidaId: socket.id.slice(-6),
          profesor: profesorId,
          tiempoPorPictograma,
          numeroDePictogramas: numeroDePictogramasInt,
          estado: "activa",
          pictogramas,
        });
    
        await partida.save();
        const linkPartida = `http://localhost:3000/partida/${partida.partidaId}`;
        socket.emit("partidaCreada", { mensaje: "Partida creada", link: linkPartida });
      } catch (error) {
        console.error("Error en iniciarPartida:", error);
        socket.emit("error", { mensaje: "Error al iniciar la partida" });
      }
    });
  

    socket.on("registroAlumno", async ({ partidaId, nombre }) => {
      try {
        // Buscamos la partida activa
        const partida = await Partida.findOne({ partidaId, estado: "activa" });
        if (!partida) {
          socket.emit("errorRegistro", { mensaje: "Partida no encontrada o ya no está activa" });
          return;
        }
    
        // Crear un nuevo estudiante y asignar pictogramas únicos
        const pictogramasAleatorios = await Pictograma.aggregate([{ $sample: { size: partida.numeroDePictogramas } }]);
        const estudiante = new Estudiante({ nombre, partida: partida._id, puntaje: 0, pictogramas: pictogramasAleatorios });
        await estudiante.save();
    
        // Agregar el estudiante a la partida
        partida.estudiantes.push(estudiante._id);
        await partida.save();
    
        // Unir al estudiante al canal de la partida y enviar pictogramas únicos al alumno
        socket.join(partidaId);
        console.log("Emitiendo registroExitoso al alumno:", socket.id);
        socket.emit("registroExitoso", { alumnoId: estudiante._id, pictogramas: pictogramasAleatorios, tiempoPorPictograma: partida.tiempoPorPictograma });
        console.log("Evento registroExitoso emitido");
        io.to(partidaId).emit("nuevoEstudiante", { nombre: estudiante.nombre });
      } catch (error) {
        console.error("Error en registroAlumno:", error);
        socket.emit("errorRegistro", { mensaje: "Error al registrar al alumno" });
      }
    });


    socket.on("verificarSeleccion", async ({ partidaId, alumnoId, respuesta }) => {
      try {
        const estudiante = await Estudiante.findById(alumnoId).populate("pictogramas");
        const partida = await Partida.findOne({ partidaId });

        if (!estudiante || !partida) {
          socket.emit("errorJuego", { mensaje: "Error al verificar la respuesta" });
          return;
        }

        const indiceActual = estudiante.indice || 0;
        const pictograma = estudiante.pictogramas[indiceActual];

        if (pictograma) {
          const esCorrecto =
            respuesta.color.trim().toLowerCase() === pictograma.color.trim().toLowerCase() &&
            parseInt(respuesta.numeroClase, 10) === pictograma.numeroClase &&
            respuesta.simbolo.trim().toLowerCase() === pictograma.simbolo.trim().toLowerCase();

          // Emitir el resultado de la verificación antes de avanzar el índice
          socket.emit("respuestaVerificada", { esCorrecto, respuestaCorrecta: pictograma });

          // Solo incrementar el índice si quedan más pictogramas y avanzar manualmente en el frontend
          estudiante.indice += 1;
          if (esCorrecto) {
            estudiante.puntaje += 1;
          }

          await estudiante.save();
        } else {
          socket.emit("errorJuego", { mensaje: "No hay más pictogramas para verificar" });
        }
      } catch (error) {
        socket.emit("errorJuego", { mensaje: "Error al verificar la respuesta" });
      }
    });
   
    
    socket.on("finalizarPartida", async ({ partidaId }) => {
      try {
        console.log("Finalizando partida:", partidaId);
        const partida = await Partida.findOne({ partidaId });
        if (partida) {
          partida.estado = "finalizada";
          await partida.save();
          io.to(partidaId).emit("partidaFinalizada", { mensaje: "La partida ha finalizado" });
        } else {
          console.warn("Partida no encontrada al finalizar:", partidaId);
          socket.emit("error", { mensaje: "Partida no encontrada" });
        }
      } catch (error) {
        console.error("Error en finalizarPartida:", error);
        socket.emit("error", { mensaje: "Error al finalizar la partida" });
      }
    });

    socket.on("validarCodigo", async (partidaId ) => {
      const partida = await Partida.findOne({ partidaId});
        if (!partida) {
          socket.emit("resultado",  false);
        
        }
        else {
          socket.emit("resultado",  true);
        }
     
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
};

module.exports = socketHandler;