const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows frontend to make requests to this backend
app.use(express.json()); // Allows the server to accept JSON data in the req.body

// Connect to Database
connectDB();

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Root Endpoint (Just for testing)
app.get("/", (req, res) => {
  res.send("Student Profiling API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
