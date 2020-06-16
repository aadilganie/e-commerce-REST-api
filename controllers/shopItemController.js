const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const ShopItem = require("../model/ShopItem");
const Shop = require("../model/Shop");
const path = require("path");

// @desc    Get shop items
// @route   GET /api/v1/shopitems
// @route   GET /api/v1/shops/:shopId/shopitems
// @access  Public
exports.getShopItems = asyncHandler(async (req, res, next) => {
  if (req.params.shopId) {
    const shop = await Shop.findById(req.params.shopId);

    if (!shop) {
      return next(
        new ErrorResponse(`No such shop with id ${req.params.shopId}`, 404)
      );
    }

    const shopItems = await ShopItem.find({ shop: req.params.shopId });
    return res
      .status(200)
      .json({ success: true, count: shopItems.length, data: shopItems });
  } else {
    res.status(200).json(res.queryResults);
  }
});

// @desc    Get shop item
// @route   GET /api/v1/shopitems/:id
// @access  Public
exports.getShopItem = asyncHandler(async (req, res, next) => {
  const shopItem = await ShopItem.findById(req.params.id);
  // Check if shopItem exists
  if (!shopItem) {
    return next(
      new ErrorResponse(`No such shop item with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: shopItem });
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

  if (shop.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add items to shop ${shop._id}`,
        401
      )
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

  // Check if shopItem exists
  if (!shopItem) {
    return next(
      new ErrorResponse(`No such shop item with id ${req.params.id}`, 404)
    );
  }

  // Check if user seller own this item
  const shop = await Shop.findById(shopItem.shop.toString());
  if (shop.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update item ${shopItem._id}`,
        401
      )
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

  // Check if shopItem exists
  if (!shopItem) {
    return next(
      new ErrorResponse(`No such shop item with id ${req.params.id}`, 404)
    );
  }

  // Check if user seller own this item
  const shop = await Shop.findById(shopItem.shop.toString());
  if (shop.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update item ${shopItem._id}`,
        401
      )
    );
  }

  await shopItem.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload item photo
// @route   PUT /api/v1/shopitems/:id/photo
// @access  Private
exports.uploadItemPhoto = asyncHandler(async (req, res, next) => {
  const shopItem = await ShopItem.findById(req.params.id);

  // Check if item exists
  if (!shopItem) {
    return next(new ErrorResponse(`No item found with id ${req.params.id}`));
  }

  // Check if user owns the item
  const shop = await Shop.findById(shopItem.shop.toString());
  if (shop.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User not authorized to access`, 401));
  }

  // Image validation
  if (
    !req.files ||
    !req.files.item ||
    !req.files.item.mimetype.startsWith("image/") ||
    req.files.item.size > process.env.MAX_FILE_UPLOAD_SIZE
  ) {
    return next(
      new ErrorResponse(
        `Please upload a valid image file under the size of ${
          parseInt(process.env.MAX_FILE_UPLOAD_SIZE) / 1000000
        } Megabyte`,
        400
      )
    );
  }

  // Build up filename
  let fileName = `photo_item_${req.params.id}${
    path.parse(req.files.item.name).ext
  }`;

  // Save image
  req.files.item.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`, (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem uploading photo`, 500));
    }
  });

  // Update photo name field
  await ShopItem.findByIdAndUpdate(
    req.params.id,
    { photo: fileName },
    { runValidators: true }
  );

  res.status(200).json({ success: true, data: fileName });
});
