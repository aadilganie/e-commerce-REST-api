const asyncHandler = require("../middlewares/asyncHander");
const ErrorResponse = require("../utils/ErrorResponse");
const Shop = require("../model/Shop");

// @desc    Get all shops
// @route   GET /api/v1/shops
// @access  Public
exports.getShops = asyncHandler(async (req, res, next) => {
  let query;
  let queryStr = { ...req.query };

  // Exclude keywords
  const keywords = ["select", "sort", "page", "limit"];
  keywords.forEach((kw) => delete queryStr[kw]);

  // Insert operators
  queryStr = JSON.stringify(queryStr);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/, (v) => `$${v}`);

  // Start buildiing query
  query = Shop.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const selectStr = req.query.select.split(",").join(" ");
    query = query.select(selectStr);
  }

  // Sort results
  if (req.query.sort) {
    const sortStr = req.query.sort.split(",").join(" ");
    query = query.sort(sortStr);
  } else {
    query = query.sort("-createdAt"); // default lastest first
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const count = await Shop.countDocuments();
  query = query.skip(startIndex).limit(limit);

  const pagination = {};
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  if (endIndex < count) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  query = query.populate({
    path: "shopitems",
    select: "title price",
  });

  const shops = await query.exec();

  res
    .status(200)
    .json({ success: true, count: shops.length, pagination, data: shops });
});

// @desc    Get shop by id
// @route   GET /api/v1/shops/:id
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
