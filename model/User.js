const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
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
});

// Hash user password before saving
UserSchema.pre("save", async function (next) {
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
