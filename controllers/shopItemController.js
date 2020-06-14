const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const ShopItem = require("../model/ShopItem");
const Shop = require("../model/Shop");

// @desc    Get shop items
// @route   GET /api/v1/shopitems
// @route   /api/v1/shops/:shopId/shopitems
// @access  Public
exports.getShopItems = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.shopId) {
    const shop = await Shop.findById(req.params.shopId);

    if (!shop) {
      return next(
        new ErrorResponse(`No such shop with id ${req.params.shopId}`, 404)
      );
    }

    query = ShopItem.find({ shop: req.params.shopId });
  } else {
    query = ShopItem.find();
  }

  query = query.populate({
    path: "shop",
    select: "name stars",
  });

  const shopItems = await query.exec();

  res
    .status(200)
    .json({ success: true, count: shopItems.length, data: shopItems });
});

// @desc    Add shop items
// @route   POST /api/v1/shops/:shopId/shopitems
// @access  Private
exports.addShopItems = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.shopId);

  if (!shop) {
    return next(
      new ErrorResponse(`No such shop with id ${req.params.shopId}`, 404)
    );
  }

  req.body.shop = req.params.shopId;
  const shopItem = await ShopItem.create(req.body);
  res.status(200).json({ success: true, data: shopItem });
});

// @desc    Update shop item
// @route   POST /api/v1/shopitems/:id
// @access  Private
exports.updateShopItem = asyncHandler(async (req, res, next) => {
  let shopItem = await ShopItem.findById(req.params.id);

  if (!shopItem) {
    return next(
      new ErrorResponse(`No such shop item with id ${req.params.id}`, 404)
    );
  }

  shopItem = await ShopItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: shopItem });
});

// @desc    Delete shop item
// @route   DELETE /api/v1/shopitems/:id
// @access  Private
exports.deleteShopItems = asyncHandler(async (req, res, next) => {
  const shopItem = await ShopItem.findById(req.params.id);

  if (!shopItem) {
    return next(
      new ErrorResponse(`No such shop item with id ${req.params.id}`, 404)
    );
  }

  await shopItem.remove();

  res.status(200).json({ success: true, data: shopItem });
});
