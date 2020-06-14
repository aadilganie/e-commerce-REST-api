const express = require("express");
const {
  getShops,
  getShopById,
  addShop,
  updateShop,
  deleteShop,
} = require("../controllers/shopController");

const router = express.Router();

router.route("/").get(getShops).post(addShop);

router.route("/:id").get(getShopById).put(updateShop).delete(deleteShop);

module.exports = router;
