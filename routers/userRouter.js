const express = require("express");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

const {
  addUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getUsers).post(addUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
