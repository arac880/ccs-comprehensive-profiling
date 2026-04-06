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
    // Replace the URL below with your actual Vercel Frontend URL
    origin: [
      "http://localhost:5173",
      "https://ccs-comprehensive-profiling-alpha.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

// Connect to Database
// In a serverless environment, this call initializes the connection
// and reuses it across function invocations.
connectDB();

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

// Root Endpoint for Health Checks
app.get("/", (req, res) => {
  res.send("Student Profiling API is running...");
});

// Conditional Listen: Vercel handles execution via exports in production.
// This block allows the server to still run normally on your local machine.
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app for Vercel Serverless Functions
module.exports = app;
