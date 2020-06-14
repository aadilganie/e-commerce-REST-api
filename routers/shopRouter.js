const express = require("express");
const {
  getShops,
  getShopById,
  addShop,
  updateShop,
  deleteShop,
} = require("../controllers/shopController");

const shopItemRouter = require("../routers/shopItemRouter");

const router = express.Router();

// Re-route
router.use("/:shopId/shopitems", shopItemRouter);

router.route("/").get(getShops).post(addShop);

router.route("/:id").get(getShopById).put(updateShop).delete(deleteShop);

module.exports = router;
