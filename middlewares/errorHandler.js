const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(error);

  // Object id cast error
  if (error.kind === "ObjectId") {
    error = new ErrorResponse(`No such shop with id of ${error.value}`, 404);
  }

  res.status(error.statusCode).json({ success: false, error: error.message });
};

module.exports = errorHandler;
