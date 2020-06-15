const express = require("express");
const filterSortSelectPage = require("../middlewares/filterSortSelectPage");
const { protect, authorize } = require("../middlewares/auth");
const Review = require("../model/Review");

const router = express.Router({ mergeParams: true });

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router
  .route("/")
  .get(filterSortSelectPage(Review), getReviews)
  .post(protect, authorize("buyer"), addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("buyer"), updateReview)
  .delete(protect, authorize("buyer"), deleteReview);

module.exports = router;
