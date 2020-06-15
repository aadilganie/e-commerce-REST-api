const express = require("express");
const {
  getShopItems,
  addShopItems,
  updateShopItem,
  deleteShopItems,
} = require("../controllers/shopItemController");
const ShopItem = require("../model/ShopItem");
const filterSortSelectPage = require("../middlewares/filterSortSelectPage");
const { protect } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(filterSortSelectPage(ShopItem, "shop"), getShopItems)
  .post(protect, addShopItems);

router
  .route("/:id")
  .put(protect, updateShopItem)
  .delete(protect, deleteShopItems);

module.exports = router;
