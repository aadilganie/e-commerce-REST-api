const jwt = require("jsonwebtoken");
const User = require("../model/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("./asyncHander");

// Make access to routes private
exports.protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;

  // Test for no token, Test for non Bearer token
  if (!token || !token.startsWith("Bearer")) {
    return next(new ErrorResponse(`Not authorized to access this route`, 400));
  } else {
    token = token.split(" ")[1];
  }

  try {
    // Attach found user to req.body
    const { data: userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(userId);
    next();
  } catch (error) {
    next(new ErrorResponse(`Not authorized to access this route`, 400));
  }
});

// Grants access to only certain roles
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorResponse(`Not authorized to access this route`, 400));
  }
  next();
};
