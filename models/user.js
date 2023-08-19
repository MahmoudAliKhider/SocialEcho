const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    min: 2,
    max: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (val) => val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      message: "Invalid Email",
    },
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 6,
    max: 30,
  },
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,

  address: {
    type: String,
    trim: true,
  },

  dateOfBirth: {
    type: Date,
    required: true,
  },
  graduationYear: {
    type: Date,
    required: true,
  },
  imageUrl: { type: String, default: null },
});
const User = mongoose.model("Users", userSchema);
module.exports = User;

