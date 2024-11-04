const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const profesorRoutes = require("./routes/profesorRoutes");
const partidaRoutes = require("./routes/partidaRoutes");
const socketHandler = require("./socket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
const pictogramaRoutes = require("./routes/pictogramaRoutes");

connectDB();
app.use(express.json());


app.use(profesorRoutes);
app.use(partidaRoutes);
app.use(pictogramaRoutes); // Nueva ruta para pictogramas

socketHandler(io);

server.listen(3001, () => console.log("Servidor escuchando en el puerto 3001"));