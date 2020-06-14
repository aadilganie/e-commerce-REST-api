const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const Shop = require("../model/Shop");

// @desc    Get all shops
// @route   /api/v1/shops
// @access  Public
exports.getShops = asyncHandler(async (req, res, next) => {
  res.json({ success: true });
});
