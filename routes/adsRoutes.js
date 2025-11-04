const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createAd,
  getAllAds,
  getActiveAds,
  updateAd,
  deleteAd,
  updateAdStatus,
} = require("../controllers/adsController");
const auth = require("../middleware/authMiddleware.js");

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ✅ Routes
router.post("/", auth, upload.single("image"), createAd); // Create ad
router.get("/", getAllAds); // Get all ads
router.get("/active", getActiveAds); // Get active ads
router.put("/:id", auth, upload.single("image"), updateAd); // Update ad
router.delete("/:id", auth, deleteAd); // Delete ad
router.put("/:id/status", updateAdStatus);

module.exports = router;
