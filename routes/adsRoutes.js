const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createAd,
  getAllAds,
  getActiveAds,
  updateAd,
  deleteAd,
  updateAdStatus,
} = require("../controllers/adsController");
const auth = require("../middleware/authMiddleware");

// ✅ Multer memory storage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Routes
router.post("/", auth, upload.single("image"), createAd); // create ad
router.get("/", getAllAds);
router.get("/active", getActiveAds);
router.put("/:id", auth, upload.single("image"), updateAd);
router.delete("/:id", auth, deleteAd);
router.put("/:id/status", auth, updateAdStatus);

module.exports = router;
