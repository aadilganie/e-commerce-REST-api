const express = require("express");
const {
  registerUser,
  loginUser,
  loadMe,
  forgotPassword,
  resetPassword,
  updateInfo,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/loadme").get(protect, loadMe);
router.route("/forgotpassword").post(forgotPassword);
router.route("/passwordreset/:resettoken").put(resetPassword);
router.route("/updateinfo").put(protect, updateInfo);
router.route("/updatepassword").put(protect, updatePassword);

module.exports = router;
