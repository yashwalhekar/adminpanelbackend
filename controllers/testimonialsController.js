const Testimonial = require("../models/testimonials.js");

// Helper function for error responses
const handleError = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
};

// CREATE
exports.createTestimonial = async (req, res) => {
  try {
    const { fullName, email, feedbackText, city, country, phone } = req.body;

    const newTestimonial = new Testimonial({
      fullName,
      email,
      feedbackText,
      city,
      country,
      phone,
    });

    const savedData = await newTestimonial.save();

    return res.status(201).json({
      success: true,
      message: "Testimonial added successfully!",
      data: savedData,
    });
  } catch (error) {
    handleError(res, error, "Failed to create testimonial");
  }
};

// GET ALL
exports.getAllTestimonials = async (_req, res) => {
  try {
    const testimonials = await Testimonial.find(
      {},
      "fullName feedbackText city country"
    )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch testimonials");
  }
};

// UPDATE
exports.updateTestimonial = async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully!",
      data: updated,
    });
  } catch (error) {
    handleError(res, error, "Failed to update testimonial");
  }
};

// DELETE
exports.deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully!",
    });
  } catch (error) {
    handleError(res, error, "Failed to delete testimonial");
  }
};
