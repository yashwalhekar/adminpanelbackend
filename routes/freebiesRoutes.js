const express = require("express");
const {
  moduleRequest,
  getAllRequests,
  deleteData,
} = require("../controllers/freebiesPdfController");

const router = express.Router();

router.post("/", moduleRequest);
router.get("/", getAllRequests);
router.delete("/:id", deleteData);

module.exports = router;
