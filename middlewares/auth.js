const jwt = require("jsonwebtoken");
const User = require("../model/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("./asyncHander");

// Make access to routes private
exports.protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;

  console.log(req.cookies["TOKEN"]);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies["TOKEN"]) {
    token = req.cookies["TOKEN"];
  }

  if (!token) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));
  }

  try {
    // Attach found user to req.body
    const { data: userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(userId);
    next();
  } catch (error) {
    next(new ErrorResponse(`Not authorized to access this route`, 401));
  }
});

// Grants access to only certain roles
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorResponse(`Not authorized to access this route`, 401));
  }
  next();
};
