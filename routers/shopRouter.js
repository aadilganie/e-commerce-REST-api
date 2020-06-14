const express = require("express");
const { getShops, getShopById } = require("../controllers/shopController");

const router = express.Router();

router.route("/").get(getShops);

router.route("/:id").get(getShopById);

module.exports = router;
