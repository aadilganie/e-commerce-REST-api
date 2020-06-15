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
    type: Number,
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

// Add index so one buyer can only post one review per item
ReviewSchema.index({ user: 1, shopItem: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
