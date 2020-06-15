const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const filterSortSelectPage = require("../middlewares/filterSortSelectPage");
const User = require("../model/User");

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

router
  .route("/")
  .get(filterSortSelectPage(User, "shops"), getUsers)
  .post(addUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
