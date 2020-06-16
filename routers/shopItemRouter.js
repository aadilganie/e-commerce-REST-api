const express = require("express");
const {
  getShopItems,
  getShopItem,
  addShopItems,
  updateShopItem,
  deleteShopItems,
  uploadItemPhoto,
} = require("../controllers/shopItemController");
const filterSortSelectPage = require("../middlewares/filterSortSelectPage");
const { protect, authorize } = require("../middlewares/auth");
const ShopItem = require("../model/ShopItem");

const router = express.Router({ mergeParams: true });

const reviewRouter = require("./reviewRouter");
router.use("/:itemId/reviews", reviewRouter);

router
  .route("/")
  .get(filterSortSelectPage(ShopItem, "shop"), getShopItems)
  .post(protect, authorize("seller", "admin"), addShopItems);

router
  .route("/:id")
  .get(getShopItem)
  .put(protect, authorize("seller", "admin"), updateShopItem)
  .delete(protect, authorize("seller", "admin"), deleteShopItems);

router
  .route("/:id/photo")
  .put(protect, authorize("seller", "admin"), uploadItemPhoto);

module.exports = router;
