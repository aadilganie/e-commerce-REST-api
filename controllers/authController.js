const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../model/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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

  const isMatch = await user.verifyPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credential`, 400));
  }

  respTokenWithCookie(user, 200, res);
});

// @desc    Logout user
// @route   GET api/v1/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("TOKEN", null, {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    })
    .json({ success: true, data: {} });
});

// @desc    Load current logged in user
// @route   POST /api/v1/auth/loadMe
// @access  Private
exports.loadMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
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

  // Generate a reset token
  const resetToken = user.genResetToken();
  await user.save();

  // Send email
  await sendEmail(
    `"Admin" <no-reply@ecommerce.com>`,
    `${email}`,
    `Password reset token`,
    `You have requested for a password reset, please make a PUT request with your oldPassword and newPassword to ${
      req.protocol
    }://${req.get("host")}/api/v1/auth/passwordreset/${resetToken}`
  );

  res.status(200).json({ success: true, resetToken });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  // Test input
  if (!newPassword) {
    return next(new ErrorResponse(`newPassword are required.`, 400));
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({ passwordResetToken: hashedToken }).select(
    "+password"
  );

  // Test if user exists
  if (!user) {
    return next(new ErrorResponse(`Invalid reset token`, 400));
  }

  // Test if token expired
  if (Date.now() > user.passwordResetExpires) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(
      new ErrorResponse(`Reset token expired, please request a new one`, 400)
    );
  }

  // Perform update
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  respTokenWithCookie(user, 200, res);
});

// @desc    Update logged in user info (email, name)
// @route   PUT apu/v1/auth/updateinfo
// @access  Private
exports.updateInfo = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: "true",
    data: { user },
  });
});

// @desc    Update logged in user password
// @route   PUT apu/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  if (!req.body.password) {
    return next(new ErrorResponse(`Password is required`, 400));
  }

  let user = await User.findById(req.user.id).select("+password");
  user.password = req.body.password;
  user = await user.save();

  respTokenWithCookie(user, 200, res);
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
