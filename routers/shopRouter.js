const express = require("express");
const { getShops } = require("../controllers/shopController");

const router = express.Router();

router.route("/").get(getShops);

module.exports = router;
