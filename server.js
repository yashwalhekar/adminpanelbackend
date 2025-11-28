require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");

require("./utils/adSchedular");

const authRoutes = require("./routes/authRoutes");
const adsRoutes = require("./routes/adsRoutes");
const taglineRoutes = require("./routes/taglineRoutes");
const usersRoutes = require("./routes/userRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const blogsRoutes = require("./routes/blogsRoutes");
const freebiesRoutes = require("./routes/freebiesRoutes");

const app = express();

// ----------- Middleware -------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://adminpanelfrontend-two.vercel.app",
      "https://herencia-hispana.vercel.app",
      "https://www.xn--herenciahispaa-2nb.com",
      "https://herenciahispana.com",
      "https://www.herenciahispana.com",
    ],
    credentials: true,
  })
);

// ------------ Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/tagline", taglineRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/freebies", freebiesRoutes);

// Default route
app.get("/", (req, res) => res.send("Backend running successfully 🚀"));

// ----------- MongoDB Connection -------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ❌ REMOVE `app.listen()` FOR VERCEL
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 👉 Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
