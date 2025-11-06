const UserForm = require("../models/userFormSchema.js");

// ✅ Create a new user form
exports.createUserForm = async (req, res) => {
  try {
    const {
      fullname,
      surname,
      country,
      gender,
      email,
      phone,
      address,
      whyToChooseSpanish,
      proficiencyLevel,
      status,
    } = req.body;

    const newForm = new UserForm({
      fullname,
      surname,
      country,
      gender,
      email,
      phone,
      address,
      whyToChooseSpanish,
      proficiencyLevel,
      status,
    });

    const savedForm = await newForm.save();

    res.status(201).json({
      success: true,
      message: "User form submitted successfully!",
      data: savedForm,
    });
  } catch (error) {
    console.error("Error creating user form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user form",
      error: error.message,
    });
  }
};

// ✅ Get all user
exports.getAllUserForms = async (req, res) => {
  try {
    const forms = await UserForm.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms,
    });
  } catch (error) {
    console.error("Error fetching user forms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user forms",
      error: error.message,
    });
  }
};

// ✅ Get a single user form by ID
exports.getUserFormById = async (req, res) => {
  try {
    const form = await UserForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "User form not found",
      });
    }
    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    console.error("Error fetching user form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user form",
      error: error.message,
    });
  }
};

// ✅ Update a user form (e.g., update status or other fields)
exports.updateUserForm = async (req, res) => {
  try {
    const form = await UserForm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "User form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User form updated successfully!",
      data: form,
    });
  } catch (error) {
    console.error("Error updating user form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user form",
      error: error.message,
    });
  }
};

// ✅ Delete a user form
exports.deleteUserForm = async (req, res) => {
  try {
    const form = await UserForm.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "User form not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User form deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting user form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user form",
      error: error.message,
    });
  }
};
