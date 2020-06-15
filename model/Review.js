const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [100, "Title must be no more than 100 characters"],
  },
  text: {
    type: String,
    required: [true, "Text is required"],
    minlength: [25, "Text must be at least 25 characters"],
  },
  star: {
    type: number,
    min: [0, "Star ranges from 0 - 5"],
    max: [5, "Star ranges from 0 - 5"],
    required: [true, "Star is requried"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopItem: {
    type: mongoose.Types.ObjectId,
    ref: "ShopItem",
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
