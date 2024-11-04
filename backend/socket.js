// backend/socket.js
const Partida = require("./models/Partida");
const Estudiante = require("./models/Estudiante");
const Pictograma = require("./models/Pictograma");
const mongoose = require("mongoose");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("iniciarPartida", async ({ profesorId, tiempoPorPictograma, numeroDePictogramas }) => {
      try {
        console.log("Iniciando partida con profesorId:", profesorId, "tiempoPorPictograma:", tiempoPorPictograma, "numeroDePictogramas:", numeroDePictogramas);
        const pictogramas = await Pictograma.aggregate([{ $sample: { size: numeroDePictogramas } }]);

        const partida = new Partida({
          partidaId: socket.id,
          profesor: profesorId,
          tiempoPorPictograma,
          numeroDePictogramas,
          estado: "activa",
          pictogramas,
        });

        await partida.save();
        const linkPartida = `http://localhost:3000/partida/${partida.partidaId}`;
        socket.emit("partidaIniciada", { mensaje: "Partida creada", link: linkPartida });
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
        const estudiante = await Estudiante.findById(alumnoId).populate("pictogramas"); // Asegúrate de poblar los pictogramas específicos del estudiante
        const partida = await Partida.findOne({ partidaId });
    
        if (!estudiante || !partida) {
          socket.emit("errorJuego", { mensaje: "Error al verificar la respuesta" });
          return;
        }
    
        // Índice actual del pictograma que se debe verificar
        const indiceActual = estudiante.indice || 0;
        const pictograma = estudiante.pictogramas[indiceActual];
    
        if (pictograma) {
          const esCorrecto = 
            respuesta.color === pictograma.color &&
            respuesta.numeroClase === pictograma.numeroClase &&
            respuesta.simbolo === pictograma.simbolo;
    
          // Emitir el resultado de la verificación
          socket.emit("respuestaVerificada", { esCorrecto, respuestaCorrecta: pictograma });
    
          // Incrementa el índice del estudiante sin importar si la respuesta fue correcta
          estudiante.indice += 1;
    
          // Si es correcto, aumenta también el puntaje
          if (esCorrecto) {
            estudiante.puntaje += 1;
          }
    
          // Guardar el estado actualizado del estudiante
          await estudiante.save();
        } else {
          console.error(`No existe pictograma para el índice ${indiceActual}`);
          socket.emit("errorJuego", { mensaje: "No hay más pictogramas para verificar" });
        }
      } catch (error) {
        console.error("Error en verificarSeleccion:", error);
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

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
};

module.exports = socketHandler;