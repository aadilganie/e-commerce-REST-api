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

// Send back token in cookie
const responseWithToken = (user, statusCode, res) => {
  const token = user.getJwtToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(statusCode)
    .cookie("TOKEN", token, cookieOptions)
    .json({ success: true, token });
};
