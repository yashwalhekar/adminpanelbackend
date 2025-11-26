const express = require("express");
const router = express.Router();
const taglineController = require("../controllers/taglineController.js");

//Routes
router.post("/", taglineController.createTagline);
router.get("/", taglineController.getAllTaglines);
router.get("/active-tags", taglineController.getActiveTagline);
router.put("/:id", taglineController.updateTagline);
router.delete("/:id", taglineController.deleteTagline);

module.exports = router;
