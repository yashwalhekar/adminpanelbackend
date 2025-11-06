const Ad = require("../models/ads");
const cloudinary = require("../config/cloudinary");

// ✅ Create new Ad
exports.createAd = async (req, res) => {
  try {
    const { title, isActive, startDate, endDate } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: "Title and image are required" });
    }

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Save Ad in DB
    const ad = await Ad.create({
      title,
      imageUrl: uploadResult.secure_url,
      isActive: isActive ?? false,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      createdBy: req.user._id, // if you track creator
    });

    res.status(201).json({ message: "Ad created successfully", ad });
  } catch (error) {
    console.error("Create ad error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

    // If a new image is uploaded, replace the old one
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "ads",
        resource_type: "image",
      });
      ad.imageUrl = uploadedImage.secure_url;
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
