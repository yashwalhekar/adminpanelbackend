require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const adsRoutes = require("./routes/adsRoutes");
const taglineRoutes = require("./routes/taglineRoutes");
const usersRoutes = require("./routes/userRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const blogsRoutes = require("./routes/blogsRoutes");
const freebiesRoutes = require("./routes/freebiesRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
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

// ❌ (Optional) Remove this if all uploads go to Cloudinary
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/tagline", taglineRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/freebies", freebiesRoutes);

// ✅ Root endpoint
app.get("/", (req, res) => res.send("Backend running successfully 🚀"));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
