const express = require("express");
const {
  getShopItems,
  addShopItems,
  updateShopItem,
  deleteShopItems,
} = require("../controllers/shopItemController");
const ShopItem = require("../model/ShopItem");
const filterSortSelectPage = require("../middlewares/filterSortSelectPage");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(filterSortSelectPage(ShopItem, "shop"), getShopItems)
  .post(protect, authorize("seller", "admin"), addShopItems);

router
  .route("/:id")
  .put(protect, authorize("seller", "admin"), updateShopItem)
  .delete(protect, authorize("seller", "admin"), deleteShopItems);

module.exports = router;
