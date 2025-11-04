// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.js");

const JWT_SECRET = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Token invalid" });

    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

module.exports = auth;
