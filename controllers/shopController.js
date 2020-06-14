const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc    Get all shops
// @route   /api/v1/shops
// @access  Public
exports.getShops = asyncHandler(async (req, res, next) => {
  res.json({ success: true });
});
