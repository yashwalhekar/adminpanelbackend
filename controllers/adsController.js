const Ad = require("../models/ads");

// ✅ Create new Ad
exports.createAd = async (req, res) => {
  try {
    const { title, isActive, startDate, endDate } = req.body;

    if (!title || !req.file)
      return res.status(400).json({ message: "Title and image are required" });

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    const ad = await Ad.create({
      title,
      imageUrl,
      isActive: isActive ?? false,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
    });

    res.status(201).json({ message: "Ad created successfully", ad });
  } catch (error) {
    console.error("Create ad error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get all Ads
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json(ads);
  } catch (error) {
    console.error("Get ads error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get active Ads only
exports.getActiveAds = async (req, res) => {
  try {
    const now = new Date();
    const ads = await Ad.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json(ads);
  } catch (error) {
    console.error("Get active ads error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Ad
exports.updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isActive, startDate, endDate } = req.body;

    const ad = await Ad.findById(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if (req.file) {
      ad.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    ad.title = title || ad.title;
    ad.isActive = isActive ?? ad.isActive;
    ad.startDate = startDate ? new Date(startDate) : ad.startDate;
    ad.endDate = endDate ? new Date(endDate) : ad.endDate;

    await ad.save();
    res.status(200).json({ message: "Ad updated successfully", ad });
  } catch (error) {
    console.error("Update ad error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete Ad
exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findById(id);

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    await ad.deleteOne();
    res.json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Delete ad error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Ad Status (Active/Inactive)
exports.updateAdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Validate input
    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "isActive must be a boolean value" });
    }

    const ad = await Ad.findById(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // Optional: Check if the logged-in user is the creator/admin
    if (ad.createdBy && ad.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    ad.isActive = isActive;
    await ad.save();

    res.status(200).json({
      message: `Ad status updated to ${isActive ? "Active" : "Inactive"}`,
      ad,
    });
  } catch (error) {
    console.error("Update ad status error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
