const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const ShopItem = require("../model/ShopItem");
const Shop = require("../model/Shop");

// @desc    Get shop items
// @route   /api/v1/shopitems
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
