const mongoose = require("mongoose");

const ShopItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required for each item"],
    maxlength: [50, "Title must be no more than 50 characters"],
  },
  description: {
    type: String,
    maxlength: [500, "Description must be no more than 50 characters"],
  },
  category: {
    type: String,
    enum: ["clothing", "electronics", "home"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qtySold: {
    type: Number,
    validate: function (v) {
      return Number.isInteger(v);
    },
    message: "quantity must be of integer",
    required: [true, "Quantity is required"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  shop: {
    type: mongoose.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
});

module.exports = mongoose.model("ShopItem", ShopItemSchema);
