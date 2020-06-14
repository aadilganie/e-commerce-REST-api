const express = require("express");
const {
  getShops,
  getShopById,
  addShop,
  updateShop,
  deleteShop,
  uploadPhoto,
} = require("../controllers/shopController");
const filterSortSelectPage = require("../middlewares/filterSortSelectPage");
const Shop = require("../model/Shop");

const shopItemRouter = require("../routers/shopItemRouter");

const router = express.Router();

// Re-route
router.use("/:shopId/shopitems", shopItemRouter);

router
  .route("/")
  .get(filterSortSelectPage(Shop, "shopitems"), getShops)
  .post(addShop);

router.route("/:id").get(getShopById).put(updateShop).delete(deleteShop);

router.route("/:id/photo").put(uploadPhoto);

module.exports = router;
