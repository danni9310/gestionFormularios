module.exports.getStatus = function getStatus() {
  return {
    module: process.env.modulo || "Gestion Formularios",
    api: true
  };
};
