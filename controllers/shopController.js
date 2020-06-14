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
  const shop = await Shop.create(req.body);
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

  // Check if there is a file
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 404));
  }

  const file = req.files.shop;

  // Check for file type and size
  if (!file.mimetype.startsWith("image/")) {
    return next(new ErrorResponse(`Please upload an image file`, 404));
  }
  if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(
        `File too large, max ${process.env.MAX_FILE_UPLOAD_SIZE}`,
        404
      )
    );
  }

  // Build up file name, location path and saves file
  const fileName = `photo_${shop._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`, async (err) => {
    if (err) {
      console.error(err.message);
      return next(new ErrorResponse(`Problem uploading the file`, 500));
    }
  });
  await Shop.findByIdAndUpdate(
    req.params.id,
    { photo: fileName },
    { runValidators: true }
  );

  res.status(200).json({ success: true, data: fileName });
});
