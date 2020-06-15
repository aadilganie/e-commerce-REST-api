const express = require("express");
const {
  registerUser,
  loginUser,
  loadMe,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/loadme").get(protect, loadMe);

module.exports = router;
