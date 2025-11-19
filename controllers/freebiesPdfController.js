const freebies = require("../models/freebiesPdfSchema");

const handleError = (res, error, message) => {
  console.log(message, error);
  res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
};

//send form data to backend

exports.moduleRequest = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const newRequest = new freebies({
      email,
      phone,
    });
    const sendRequest = await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Request added successfully!!",
      data: sendRequest,
    });
  } catch (error) {
    console.log(error.message);
    handleError();
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await freebies.find().sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      message: "Data get successfully!!",
      data: requests,
    });
  } catch (error) {
    console.log(error.message);
    handleError();
  }
};
