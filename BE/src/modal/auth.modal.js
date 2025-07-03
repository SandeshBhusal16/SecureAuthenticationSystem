const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true, // Removes unnecessary spaces
      lowercase: true, // Ensures case insensitivity
    },
    phone: {
      type: Number,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    activationToken: {
      type: String,
    },
    password: {
      type: String,
    },
    passwordCreatedAt: {
      type: Date,
      default: Date.now,
    },
    passwordChangedAt: {
      type: Date,
    },

    forgotPassToken: String,
    expiryTime: Date,
  },
  { autoCreate: true, autoIndex: true, timestamps: true }
);

const authModal = mongoose.model("user", Schema);
module.exports = authModal;
