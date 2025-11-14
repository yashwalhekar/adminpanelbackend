const express = require("express");
const {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
} = require("../controllers/blogsController");
const router = express.Router();

router.post("/", createBlog);
router.get("/", getAllBlogs);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.put("/:id/status", toggleBlogStatus);

module.exports = router;
