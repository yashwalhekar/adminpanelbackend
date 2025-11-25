const Ad = require("../models/ads");
const cloudinary = require("../config/cloudinary");

// ✅ Helper: upload image to Cloudinary (stream-based & reusable)
const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ads", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(fileBuffer);
  });

// ✅ Create new Ad
exports.createAd = async (req, res) => {
  try {
    const { title, isActive, startDate, endDate } = req.body;

    if (!title || !req.file)
      return res.status(400).json({ message: "Title and image are required" });

    // Parallel processing — upload to Cloudinary while DB is ready
    const [uploadResult] = await Promise.all([
      uploadToCloudinary(req.file.buffer),
    ]);

    const ad = await Ad.create({
      title,
      imageUrl: uploadResult.secure_url,
      isActive: Boolean(isActive),
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({ message: "Ad created successfully", ad });
  } catch (error) {
    console.error("Create ad error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all Ads (Paginated + Indexed + Lightweight)
exports.getAllAds = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = search ? { title: { $regex: search, $options: "i" } } : {};

    const [ads, total] = await Promise.all([
      Ad.find(query)
        .select("title imageUrl isActive startDate endDate createdAt") // Return only needed fields
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(), // Faster than normal find (no mongoose overhead)
      Ad.countDocuments(query),
    ]);

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      ads,
    });
  } catch (error) {
    console.error("Get ads error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get only Active Ads (use lean + projection)
exports.getActiveAds = async (req, res) => {
  try {
    const now = new Date();

    const ads = await Ad.find({
      startDate: { $lte: now },
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    })
      .select("title imageUrl startDate endDate")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Ad (optimized with conditional updates)
exports.updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isActive, startDate, endDate } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(typeof isActive !== "undefined" && { isActive }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    };

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      updateData.imageUrl = uploadedImage.secure_url;
    }

    const updatedAd = await Ad.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAd) return res.status(404).json({ message: "Ad not found" });

    res.status(200).json({ message: "Ad updated successfully", ad: updatedAd });
  } catch (error) {
    console.error("Update ad error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete Ad (with optional Cloudinary cleanup)
exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findById(id);

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // Optional: delete Cloudinary image
    // await cloudinary.uploader.destroy(ad.imageUrl.split("/").pop().split(".")[0]);

    await ad.deleteOne();
    res.json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Delete ad error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update Ad Status
exports.updateAdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean")
      return res.status(400).json({ message: "isActive must be a boolean" });

    const updatedAd = await Ad.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!updatedAd) return res.status(404).json({ message: "Ad not found" });

    res.status(200).json({
      message: `Ad status updated to ${isActive ? "Active" : "Inactive"}`,
      ad: updatedAd,
    });
  } catch (error) {
    console.error("Update ad status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
