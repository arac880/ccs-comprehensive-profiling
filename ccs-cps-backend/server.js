const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ccs-comprehensive-profiling-alpha.vercel.app",
      "https://ccs-comprehensive-profiling-beta.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

/**
 * SERVERLESS OPTIMIZATION:
 * We use a middleware to ensure the database is connected before
 * any request reaches the routes. This prevents the "Call connectDB first"
 * error that causes serverless crashes.
 */
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database middleware error:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error: Database Connection Failed" });
  }
});

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

// Root Endpoint for Health Checks
app.get("/", (req, res) => {
  res.send("Student Profiling API is running...");
});

// Start server for local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
