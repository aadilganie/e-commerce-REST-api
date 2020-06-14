// wraps around async controller functions to eliminate try catch block
// Errors are passed into errorHandler middleware

const asyncHandler = (fn) => async (req, res, next) =>
  Promise.resolve(fn(req, res, next).catch(next));

module.exports = asyncHandler;
