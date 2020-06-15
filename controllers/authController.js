const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../model/User");
const sendEmail = require("../utils/sendEmail");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  respTokenWithCookie(user, 200, res);
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

  respTokenWithCookie(user, 200, res);
});

// @desc    Load current logged in user
// @route   POST /api/v1/auth/loadMe
// @access  Private
exports.loadMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user });
});

// Send back token in cookie
const respTokenWithCookie = (user, statusCode, res) => {
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

// @desc    Forgot password
// @route   POST api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorResponse(`Email is required.`, 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse(`No user with email ${email}`, 404));
  }

  // Send email
  await sendEmail(
    `"Admin" <no-reply@ecommerce.com>`,
    `${email}`,
    `Password reset token`,
    `You have requested for a password reset, please make a PUT request with your oldPassword and newPassword to ${
      req.protocol
    }://${req.get("host")}/api/auth/passwordreset/${user._id}.`
  );

  // Generate a reset token
  const resetToken = user.genResetToken();

  res.status(200).json({ success: true, resetToken });
});
