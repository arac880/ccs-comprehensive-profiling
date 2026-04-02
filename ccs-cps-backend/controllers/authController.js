const { getDB } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const db = getDB();
    let user = null;
    let role = null;

    // 1. Try student first
    user = await db.collection("students").findOne({ studentId: id });
    if (user) role = "student";

    // 2. Try faculty
    if (!user) {
      user = await db.collection("faculty").findOne({ facultyId: id });
      if (user) role = user.isDean ? "dean" : "faculty";
    }

    // 3. Not found
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    // 4. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // 5. Generate token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({
      token,
      role,
      user: {
        id: user.studentId || user.facultyId,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

module.exports = { login };
