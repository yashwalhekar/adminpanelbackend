const UserForm = require("../models/userFormSchema.js");

// 🔹 Reusable error handler
const handleError = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
};

// ✅ CREATE - Add new UserForm
exports.createUserForm = async (req, res) => {
  try {
    const { fullname, country, city, email, phone, status } = req.body;

    const newForm = new UserForm({
      fullname,
      country,
      city,
      email,
      phone,
      status,
    });

    const savedData = await newForm.save();

    res.status(201).json({
      success: true,
      message: "User form submitted successfully!",
      data: savedData,
    });
  } catch (error) {
    handleError(res, error, "Failed to create user form");
  }
};

// ✅ GET ALL USERS
exports.getAllUserForms = async (_req, res) => {
  try {
    const forms = await UserForm.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms,
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch user forms");
  }
};

// ✅ GET USER BY ID
exports.getUserFormById = async (req, res) => {
  try {
    const form = await UserForm.findById(req.params.id).lean();

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
    handleError(res, error, "Failed to fetch user form");
  }
};

// ✅ UPDATE USER FORM
exports.updateUserForm = async (req, res) => {
  try {
    const updatedForm = await UserForm.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({
        success: false,
        message: "User form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User form updated successfully!",
      data: updatedForm,
    });
  } catch (error) {
    handleError(res, error, "Failed to update user form");
  }
};

// ✅ DELETE USER FORM
exports.deleteUserForm = async (req, res) => {
  try {
    const deletedForm = await UserForm.findByIdAndDelete(req.params.id);

    if (!deletedForm) {
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
    handleError(res, error, "Failed to delete user form");
  }
};
