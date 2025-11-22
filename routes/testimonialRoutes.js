const express = require("express");
const {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
  getActiveTestimonials,
  toggleTestimonialStatus,
} = require("../controllers/testimonialsController");

const router = express.Router();

router.post("/", createTestimonial);
router.get("/", getAllTestimonials);
router.get("/active-testimonials", getActiveTestimonials);
router.put("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);
router.put("/:id/status", toggleTestimonialStatus);

module.exports = router;
