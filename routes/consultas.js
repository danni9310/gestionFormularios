const express = require("express");
const expressJoi = require("express-joi-validator");

const router = express.Router();

const consultas = require("../controllers/consultas/consultas");
const schemas = require("../controllers/consultas/schemas");

router.post(
  "/api/v1/gestion/formularios/descarga",
  expressJoi(schemas.validateVariables),
  (req, res) => {
    consultas.visualizarRespuestasVariables(res, req.body);
  }
);

router.post(
  "/api/v1/gestion/formularios/grupos",
  expressJoi(schemas.validateVariablesGrupos),
  (req, res) => {
    consultas.visualizarRespuestasVariablesGrupos(res, req.body);
  }
);

router.get("/api/v1/gestion/formularios/colecciones", (req, res) => {
  consultas.getCollectionAvailable(res);
});

router.get("/api/v1/gestion/formularios/:collection", (req, res) => {
  consultas.getDocumentsCollection(res, req.params.collection);
});

router.get(
  "/api/v1/gestion/formularios/variables/:collection&:key",
  (req, res) => {
    consultas.getVariablesDocuments(res, req.params.collection, req.params.key);
  }
);

module.exports = router;
