const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const Shop = require("../model/Shop");
const path = require("path");

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
  let shop = await Shop.findOne({ user: req.user.id });
  if (shop) {
    return next(new ErrorResponse(`A user can have at most one shop`, 400));
  }
  req.body.user = req.user.id;
  shop = await Shop.create(req.body);
  res.status(200).json({ success: true, data: shop });
});

// @desc    Update a shop
// @route   PUT /api/v1/shops/:id
// @access  Private
exports.updateShop = asyncHandler(async (req, res, next) => {
  let shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(
      new ErrorResponse(`No such shop with id of ${req.params.id}`, 404)
    );
  }

  if (shop.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} not authorized to update shop ${shop._id}`,
        401
      )
    );
  }

  shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: shop });
});

// @desc    Delete a shop
// @route   DELETE /api/v1/shops/:id
// @access  Private
exports.deleteShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(
      new ErrorResponse(`No such shop with id of ${req.params.id}`, 404)
    );
  }

  if (shop.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} not authorized to delete shop ${shop._id}`,
        401
      )
    );
  }

  await shop.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload a photo
// @route   PUT /api/v1/shops/:id/photo
// @access  Private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  // Check shop exists
  if (!shop) {
    return next(
      new ErrorResponse(`No such shop with id ${req.params.id}`, 404)
    );
  }

  if (shop.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} not authorized to update shop ${shop._id}`,
        401
      )
    );
  }

  // Image validation
  if (
    !req.files ||
    !req.files.shop ||
    !req.files.shop.mimetype.startsWith("image/") ||
    req.files.shop.size > process.env.MAX_FILE_UPLOAD_SIZE
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
    path.parse(req.files.shop.name).ext
  }`;

  // Save image
  req.files.shop.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`, (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem uploading photo`, 500));
    }
  });

  await Shop.findByIdAndUpdate(
    req.params.id,
    { photo: fileName },
    { runValidators: true }
  );

  res.status(200).json({ success: true, data: fileName });
});
