// routes/facultyRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // your JWT middleware
const Faculty = require("../models/Faculty");

// GET logged-in faculty's own profile
router.get("/profile", protect, async (req, res) => {
  try {
    // req.user._id comes from your JWT middleware
    const faculty = await Faculty.findById(req.user._id).select("-password");

    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update own profile (editable fields only)
router.put("/profile", protect, async (req, res) => {
  try {
    const allowedUpdates = [
      "contactNumber",
      "address",
      "officeLocation",
      "schedule",
      "twoFAEnabled",
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updated = await Faculty.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true },
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
