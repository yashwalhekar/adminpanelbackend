const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true }, // served path or remote URL
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // 🔹 New fields added
    isActive: {
      type: Boolean,
      default: false, // only active ads should show on the site
    },
    startDate: {
      type: Date,
      default: Date.now, // when ad becomes active
    },
    endDate: {
      type: Date, // when ad expires
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ad", adSchema);
