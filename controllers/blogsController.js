const Blog = require("../models/blogs");
const cloudinary = require("../config/cloudinary");

// Upload image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blogs", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(fileBuffer);
  });

exports.createBlog = async (req, res) => {
  try {
    const { title, creator, content, wordFile, timeChips, slugs } = req.body;

    if (!title || !creator || !content || !slugs) {
      return res
        .status(400)
        .json({ message: "Title, creator, and content are required" });
    }

    let imgUrl = null;

    // Upload image only if file exists
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imgUrl = uploadResult.secure_url;
    }

    const newBlog = await Blog.create({
      title,
      creator,
      content,
      wordFile,
      imgUrl,
      timeChips,
      slugs,
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, creator, content, slugs, timeChips } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, creator, content, slugs, timeChips },
      { new: true }
    );

    if (!updatedBlog)
      return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog)
      return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Blog Status
exports.toggleBlogStatus = async (req, res) => {
  try {
    const blogItem = await Blog.findById(req.params.id);

    if (!blogItem) return res.status(404).json({ message: "Blog not found" });

    blogItem.status = !blogItem.status;
    await blogItem.save();

    res.status(200).json({
      message: `Blog ${
        blogItem.status ? "activated" : "deactivated"
      } successfully`,
      blog: blogItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
