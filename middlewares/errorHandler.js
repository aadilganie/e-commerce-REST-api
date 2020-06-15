const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(error);

  // Object id cast error
  if (error.kind === "ObjectId") {
    error = new ErrorResponse(
      `No such resource with id of ${error.value}`,
      404
    );
  }

  // Duplicate key error
  if (error.code === 11000) {
    error = new ErrorResponse(`Duplicate key error`, 400);
  }

  // Validator errors
  if (error.errors) {
    error = new ErrorResponse(
      Object.values(error.errors)
        .map((err) => err.properties.message)
        .join(" "),
      400
    );
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server error" });
};

module.exports = errorHandler;
