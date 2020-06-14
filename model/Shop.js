const mongoose = require("mongoose");
const slugify = require("slugify");

const ShopSchema = new mongoose.Schema(
  {
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
      validate: function (v) {
        return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(v);
      },
      message: "Please provide a valid phone number",
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      match: [
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
        "Please provide a valid email address",
      ],
    },
    stars: Number,
    averagePrice: Number,
    photo: String,
    badges: {
      type: [String],
      default: [],
      enum: ["Shop of the week", "Shop of the month", "Shop of the year"],
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Cascade delete
ShopSchema.pre("remove", async function (next) {
  console.log("ran");
  await this.model("ShopItem").deleteMany({ shop: this._id });
  next();
});

// Virtual fields
ShopSchema.virtual("shopitems", {
  ref: "ShopItem",
  localField: "_id",
  foreignField: "shop",
  justOne: false,
});

// Product slugs
ShopSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Shop", ShopSchema);
