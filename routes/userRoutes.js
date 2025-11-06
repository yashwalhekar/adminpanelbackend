const express = require("express");
const router = express.Router();
const {
  createUserForm,
  getAllUserForms,
  getUserFormById,
  updateUserForm,
  deleteUserForm,
} = require("../controllers/usersController.js");

router.post("/", createUserForm);
router.get("/", getAllUserForms);
router.get("/:id", getUserFormById);
router.put("/:id", updateUserForm);
router.delete("/:id", deleteUserForm);

module.exports = router;
