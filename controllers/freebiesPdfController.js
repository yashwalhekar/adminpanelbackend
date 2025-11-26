const freebies = require("../models/freebiesPdfSchema");

// Reusable error handler
const handleError = (res, error, message = "Server error") => {
  console.log(message, error.message);
  return res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
};

exports.moduleRequest = async (req, res) => {
  try {
    const { email, phone } = req.body;
    console.log("REQ BODY =>", req.body);
    const newRequest = new freebies({ email, phone });
    const savedData = await newRequest.save();

    return res.status(201).json({
      success: true,
      message: "Request submitted successfully!",
      data: savedData,
    });
  } catch (error) {
    return handleError(res, error, "Failed to submit request.");
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await freebies.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      message: "Data retrieved successfully!",
      data: requests,
    });
  } catch (error) {
    return handleError(res, error, "Failed to retrieve data.");
  }
};

//delete

exports.deleteData = async (req, res) => {
  try {
    const deleteFreebie = await freebies.findByIdAndDelete(req.params.id);

    if (!deleteFreebie) {
      return res.status(404).json({ message: "freebie not found" });
    }
    res.status(200).json({ message: "Freebiw deleted successfully" });
  } catch (error) {
    return handleError(res, error, "Failed to delete data.");
  }
};
