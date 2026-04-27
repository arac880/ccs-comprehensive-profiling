const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors    = require("cors");
const path    = require("path");
require("dotenv").config();

const { connectDB } = require("./config/db");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware FIRST (order matters!) ──────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ─────────────────────────────────────────────────
app.use("/api/students",  require("./routes/studentRoutes"));
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/events",    require("./routes/eventRoutes"));
app.use("/api/faculty",   require("./routes/facultyRoutes"));
app.use("/api/schedules", require("./routes/schedule"));
app.use("/api/posts",     require("./routes/posts"));
app.use("/api/submissions", require("./routes/submissions")); // ← after middleware

app.get("/", (_req, res) => res.send("Student Profiling API is running..."));

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