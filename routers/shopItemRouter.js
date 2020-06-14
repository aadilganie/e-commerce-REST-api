const express = require("express");
const { getShopItems } = require("../controllers/shopItemController");

const router = express.Router({ mergeParams: true });

router.route("/").get(getShopItems);

module.exports = router;
