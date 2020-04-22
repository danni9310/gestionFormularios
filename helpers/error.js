class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  let { statusCode, message } = err;
  console.log("Error: ", message);
  if (message.includes("child")) message = "Datos de entrada no válidos";
  res.status(statusCode).json({
    status: statusCode,
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError
};
