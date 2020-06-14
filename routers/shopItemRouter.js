const express = require("express");
const {
  getShopItems,
  addShopItems,
  updateShopItem,
  deleteShopItems,
} = require("../controllers/shopItemController");
const ShopItem = require("../model/ShopItem");
const filterSortSelectPage = require("../middlewares/filterSortSelectPage");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(filterSortSelectPage(ShopItem, "shop"), getShopItems)
  .post(addShopItems);

router.route("/:id").put(updateShopItem).delete(deleteShopItems);

module.exports = router;
