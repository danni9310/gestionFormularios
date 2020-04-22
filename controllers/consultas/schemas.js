const Joi = require("joi");

const validateVariables = {
  body: {
    fechaInicial: Joi.number().required(),
    fechaFinal: Joi.number().required(),
    consulta: Joi.array().required()
  }
};

const validateVariablesGrupos = {
  body: {
    fechaInicial: Joi.number().required(),
    fechaFinal: Joi.number().required(),
    consulta: Joi.array().required(),
    grupo: Joi.string().required()
  }
};

module.exports = {
  validateVariables,
  validateVariablesGrupos
};
