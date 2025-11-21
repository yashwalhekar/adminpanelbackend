const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    creator: { type: String, required: true, trim: true },
    content: { type: String, required: true },

    wordFile: { type: String },

    imgUrl: { type: String },

    timeChips: { type: String },

    slug: { type: String, required: true },

    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blogs", blogSchema);
