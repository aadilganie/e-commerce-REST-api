const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const Shop = require("../model/Shop");

// @desc    Get all shops
// @route   GET /api/v1/shops
// @access  Public
exports.getShops = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.queryResults);
});

// @desc    Get shop by id
// @route   GET /api/v1/shops/:id
// @access  Public
exports.getShopById = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id).populate("shopitems");

  if (!shop) {
    return next(
      new ErrorResponse(`No such shop with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: shop });
});

// @desc    Add a new shop
// @route   POST /api/v1/shops
// @access  Private
exports.addShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.create(req.body);
  res.status(200).json({ success: true, data: shop });
});

// @desc    Update a shop
// @route   PUT /api/v1/:id
// @access  Private
exports.updateShop = asyncHandler(async (req, res, next) => {
  let shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(
      new ErrorResponse(`No such shop with id of ${req.params.id}`, 404)
    );
  }

  shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: shop });
});

// @desc    Delete a shop
// @route   DELETE /api/v1/:id
// @access  Private
exports.deleteShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(
      new ErrorResponse(`No such shop with id of ${req.params.id}`, 404)
    );
  }

  await shop.remove();
  res.status(200).json({ success: true, data: {} });
});
