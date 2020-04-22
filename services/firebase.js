const admin = require("firebase-admin");
const config = require("../config/config");

admin.initializeApp({
  credential: admin.credential.cert(config.firebase),
  databaseURL: config.parametros.databaseURL
});

module.exports = admin;
