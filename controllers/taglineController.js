const Tagline = require("../models/taglineSchema.js");

// ✅ Create tagline
exports.createTagline = async (req, res) => {
  try {
    const { text, discountPercent, startDate, endDate, isActive } = req.body;

    // Optional: deactivate old taglines if new one is active
    if (isActive) {
      await Tagline.updateMany({ isActive: true }, { isActive: false });
    }

    const tagline = new Tagline({
      text,
      discountPercent,
      startDate,
      endDate,
      isActive,
    });

    await tagline.save();
    res.status(201).json({ message: "Tagline created successfully", tagline });
  } catch (error) {
    res.status(500).json({ message: "Error creating tagline", error });
  }
};

// ✅ Get all taglines
exports.getAllTaglines = async (req, res) => {
  try {
    const taglines = await Tagline.find().sort({ createdAt: -1 });
    res.status(200).json(taglines);
  } catch (error) {
    res.status(500).json({ message: "Error fetching taglines", error });
  }
};

// ✅ Get active tagline (for showing on website)
exports.getActiveTagline = async (req, res) => {
  try {
    const tagline = await Tagline.findOne({ isActive: true });
    if (!tagline)
      return res.status(404).json({ message: "No active tagline found" });
    res.status(200).json(tagline);
  } catch (error) {
    res.status(500).json({ message: "Error fetching active tagline", error });
  }
};

// ✅ Update tagline
exports.updateTagline = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, discountPercent, startDate, endDate, isActive } = req.body;

    if (isActive) {
      await Tagline.updateMany({ isActive: true }, { isActive: false });
    }

    const tagline = await Tagline.findByIdAndUpdate(
      id,
      { text, discountPercent, startDate, endDate, isActive },
      { new: true }
    );

    if (!tagline) return res.status(404).json({ message: "Tagline not found" });
    res.status(200).json({ message: "Tagline updated successfully", tagline });
  } catch (error) {
    res.status(500).json({ message: "Error updating tagline", error });
  }
};

// ✅ Delete tagline
exports.deleteTagline = async (req, res) => {
  try {
    const { id } = req.params;
    await Tagline.findByIdAndDelete(id);
    res.status(200).json({ message: "Tagline deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tagline", error });
  }
};
