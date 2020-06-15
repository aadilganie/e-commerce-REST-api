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
const { protect } = require("../middlewares/auth");
const Shop = require("../model/Shop");

const shopItemRouter = require("../routers/shopItemRouter");

const router = express.Router();

// Re-route
router.use("/:shopId/shopitems", shopItemRouter);

router
  .route("/")
  .get(filterSortSelectPage(Shop, "shopitems"), getShops)
  .post(protect, addShop);

router
  .route("/:id")
  .get(getShopById)
  .put(protect, updateShop)
  .delete(protect, deleteShop);

router.route("/:id/photo").put(protect, uploadPhoto);

module.exports = router;
