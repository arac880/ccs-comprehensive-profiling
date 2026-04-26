const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");

// Routes
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ─── Routes ────────────────────────────────────────────────
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/faculty", facultyRoutes);

app.use("/api/schedules", require("./routes/schedule"));


app.get("/", (req, res) => {
  res.send("Student Profiling API is running...");
});

const startServer = async () => {
  try {
    await connectDB(); 

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log("MongoDB Connected Successfully");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();
