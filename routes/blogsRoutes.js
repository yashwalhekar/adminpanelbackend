const express = require("express");
const multer = require("multer");
const {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  getBlogBySlug,
} = require("../controllers/blogsController");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// ✅ Multer memory storage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post("/", auth, upload.single("image"), createBlog); // create blog
router.get("/", getAllBlogs);
router.get("/slug/:slug", getBlogBySlug); // Single by slug
router.put("/:id", auth, upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);
router.put("/:id/status", toggleBlogStatus);

module.exports = router;
