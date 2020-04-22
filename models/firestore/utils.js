const construirWhere = function construirWhere(dataRef, condiciones) {
  condiciones.map(k => {
    dataRef = dataRef.where(k.campo, k.condicion, k.valor);
    return dataRef;
  });
  return dataRef;
};

const MyError = function myError(parameters) {
  this.message = parameters.message;
  this.status = parameters.status;
};

MyError.prototype = Object.create(Error.prototype);
MyError.prototype.constructor = MyError;

module.exports = {
  construirWhere,
  MyError
};
