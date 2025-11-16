const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");
const usersRoutes = require("./routes/users");
const schedulesRoutes = require("./routes/schedules");
const studentRoutes = require("./routes/students");
const feedbackRoutes = require("./routes/feedbacks");
const path = require("path");

// Serve images (avatars) as static
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/tutor", schedulesRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/feedbacks", feedbackRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
