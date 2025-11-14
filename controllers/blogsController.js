const blog = require("../models/blogs.js");

exports.createBlog = async (req, res) => {
  try {
    const { title, creator, content, wordFileUrl } = req.body;
    if (!title || !creator || !content) {
      return res
        .status(400)
        .json({ message: "Title,creator,and content are required" });
    }
    const newBlog = new blog({ title, creator, content, wordFileUrl });
    await newBlog.save();

    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.log("Failed to create blog", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, creator, content } = req.body;
    const blog = await blog.findByIdAndUpdate(
      req.params.id,
      { title, creator, content },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleBlogStatus = async (req, res) => {
  try {
    const blogItem = await blog.findById(req.params.id);
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
