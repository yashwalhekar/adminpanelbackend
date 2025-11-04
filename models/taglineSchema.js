const mongoose = require("mongoose");

const taglineSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // only one tagline may be active at a time
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tagline", taglineSchema);
