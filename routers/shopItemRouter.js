const express = require("express");
const {
  getShopItems,
  addShopItems,
} = require("../controllers/shopItemController");

const router = express.Router({ mergeParams: true });

router.route("/").get(getShopItems).post(addShopItems);

module.exports = router;
