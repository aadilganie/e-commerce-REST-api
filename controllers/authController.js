const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../model/User");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  responseWithToken(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse(`Email and password is required`, 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse(`No user with email ${email}`, 400));
  }
  console.log(user);

  const isMatch = await user.verifyPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credential`, 400));
  }

  responseWithToken(user, 200, res);
});

const responseWithToken = (user, statusCode, res) => {
  const token = user.getJwtToken(user.id);
  res.status(statusCode).json({ success: true, token });
};
