const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Shop = require("./Shop");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      match: [
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
        "Please provide a valid email address",
      ],
      unique: [true, "Email is already taken"],
    },
    role: {
      type: String,
      required: true,
      enum: ["buyer", "seller"],
      default: "buyer",
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least characters"],
      select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("shops", {
  ref: "Shop",
  localField: "_id",
  foreignField: "user",
  onlyOne: false,
});

// Delete seller cascade delete shop
UserSchema.pre("remove", async function (next) {
  if (this.role === "seller") {
    const shop = await Shop.findOne({ user: this._id });
    await shop.remove();
  }
  next();
});

// Generate reset token
UserSchema.methods.genResetToken = function () {
  const plain = crypto.randomBytes(20).toString("hex");
  const hashed = crypto.createHash("sha256").update(plain).digest("hex");

  this.passwordResetToken = hashed;
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return plain;
};

// Hash user password before saving
UserSchema.pre("save", async function (next) {
  if (!this.modifiedPaths().includes("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Verify a password
UserSchema.methods.verifyPassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Sign and return a jwt
UserSchema.methods.getJwtToken = function (userId) {
  return jwt.sign({ data: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};

module.exports = mongoose.model("User", UserSchema);
