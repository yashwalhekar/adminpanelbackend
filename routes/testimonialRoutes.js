const express = require("express");
const {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialsController");

const router = express.Router();

router.post("/", createTestimonial);
router.get("/", getAllTestimonials);
router.put("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);

module.exports = router;
