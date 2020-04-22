const acl = require("express-acl");

acl.config({
  baseUrl: "/",
  filename: "policies.json",
  path: "config",
  roleSearchPath: "user.rol",
  status: "Acceso denegado",
  message: "No estas autorizado para consumir este servicio."
});

module.exports = acl;
