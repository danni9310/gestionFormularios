const express = require("express");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");

const estado = require("./routes/estado");
const consultas = require("./routes/consultas");
const swaggerDocument = require("./docs/swagger.json");
const { handleError } = require("./helpers/error");

const app = express();

const checkIfAuthenticated = require("./middlewares/firebaseAuth");
const acl = require("./middlewares/policies");
// app.use(acl.authorize); // Comentado hasta que se configuren los ROLES

// Habilitar parsear datos y sobreescribir metodos http
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, authorization, token_refresh"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/estado", estado);
app.use("/consultas", checkIfAuthenticated, consultas);

app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;
  handleError(err, res);
});

// Custom 404 route not found handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: "No existe la ruta"
  });
});

// Esto hace posible reconocer la variable en diferentes archivos.
module.exports = app;
