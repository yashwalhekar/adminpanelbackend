const express = require("express");
const {
  moduleRequest,
  getAllRequests,
} = require("../controllers/freebiesPdfController");

const router = express.Router();

router.post("/", moduleRequest);
router.get("/", getAllRequests);

module.exports = router;
