require("dotenv").config();
const http = require("http");

const config = require("./config/config");
const app = require("./app");

const logger = console.log.bind(console, "gestion_formularios");

// Levantamiento del servidor
const server = http.createServer(app);

// Escuchar el servidor en el puerto determinado
server.listen(process.env.PORT || config.server.puerto);

logger(
  `------------- ${config.parametros.nombre} escuchando por el puerto ${config.server.puerto} en ${config.parametros.entorno} -------------`
);
