const mongoose = require("mongoose");
const slugify = require("slugify");

const ShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: [true, "Name must be unique"],
    trim: true,
    maxlength: [25, "Name must be under 25 characters"],
    minlength: [5, "Name must be more than 5 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Descripiton is required"],
    maxlength: [500, "Descripiton must be under 500 characters"],
    minlength: [5, "Descripiton must be more than 5 characters"],
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    match: [
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      ["Please provide a valid phone number"],
    ],
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    match: [
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
      "Please provide a valid email address",
    ],
  },
  stars: Number,
  averageCost: Number,
  photo: String,
  badges: {
    type: [String],
    enum: ["Shop of the week", "Shop of the month", "Shop of the year"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

ShopSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

module.exports = mongoose.model("Shop", ShopSchema);
