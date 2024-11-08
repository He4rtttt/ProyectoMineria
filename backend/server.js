const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");  // Importa el paquete CORS
const connectDB = require("./config/db");
const routes = require("./routes");
const socketHandler = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });  // Permitir CORS desde cualquier origen

connectDB();
app.use(express.json());

// Configura CORS en Express para aceptar cualquier origen
app.use(cors());

// Usar el prefijo '/api' para todas las rutas de la API
app.use("/api", routes);

socketHandler(io);

server.listen(3001, () => console.log("Servidor escuchando en el puerto 3001"));