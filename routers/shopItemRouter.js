const express = require("express");
const {
  getShopItems,
  addShopItems,
  updateShopItem,
  deleteShopItems,
} = require("../controllers/shopItemController");

const router = express.Router({ mergeParams: true });

router.route("/").get(getShopItems).post(addShopItems);

router.route("/:id").put(updateShopItem).delete(deleteShopItems);

module.exports = router;
