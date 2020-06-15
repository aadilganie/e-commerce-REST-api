const asyncHandler = require("../middlewares/asyncHander.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const Review = require("../model/Review");
const ShopItem = require("../model/ShopItem");

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/shopitems/:itemId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  // Send back reviews of a given shopItem
  if (req.params.itemId) {
    const reviews = await Review.find({ shopItem: req.params.itemId });
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  }
  // Send back all reviews
  res.status(200).json(res.queryResults);
});

// @desc    Get a review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  // Check if review exists
  if (!review) {
    return next(
      new ErrorResponse(`No such review with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @desc    Add a review
// @route   POST /api/v1/shopitems/:itemId/reviews
// @access  Private - role: buyer only
exports.addReview = asyncHandler(async (req, res, next) => {
  const shopItem = await ShopItem.findById(req.params.itemId);

  // Check if shop item exist
  if (!shopItem) {
    return next(
      new ErrorResponse(`No such item with id ${req.params.itemId}`, 404)
    );
  }

  // Attach shopItem and user required fields to request body to be created
  req.body.shopItem = shopItem._id;
  req.body.user = req.user.id;

  const review = await Review.create(req.body);
  res.status(200).json({ success: true, data: review });
});

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/shopitems/:itemId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  // Send back reviews of a given shopItem
  if (req.params.itemId) {
    const reviews = await Review.find({ shopItem: req.params.itemId });
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  }
  // Send back all reviews
  res.status(200).json(res.queryResults);
});

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  // Check if review exists
  if (!review) {
    return next(
      new ErrorResponse(`No such review with id ${req.params.id}`, 404)
    );
  }

  // Check if user owns this review or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to access`, 401));
  }

  // Perform update
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  // Check if review exists
  if (!review) {
    return next(
      new ErrorResponse(`No such review with id ${req.params.id}`, 404)
    );
  }

  // Check if user owns this review or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to access`, 401));
  }

  // Perform delete
  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
