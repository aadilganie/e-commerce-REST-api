const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const Shop = require("../model/Shop");

// @desc    Get all shops
// @route   /api/v1/shops
// @access  Public
exports.getShops = asyncHandler(async (req, res, next) => {
  const shops = await Shop.find();
  res.status(200).json({ success: true, data: shops });
});

// @desc    Get shop by id
// @route   /api/v1/shops/:id
// @access  Public
exports.getShopById = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(
      new ErrorResponse(`No such shop with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: shop });
});
