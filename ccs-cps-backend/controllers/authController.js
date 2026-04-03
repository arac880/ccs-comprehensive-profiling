const { getDB } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const db = getDB();
    let user = null;
    let role = null;

    user = await db.collection("students").findOne({ studentId: id });
    if (user) role = "student";

    if (!user) {
      user = await db.collection("faculty").findOne({ facultyId: id });
      if (user) role = user.isDean ? "dean" : "faculty";
    }

    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    const userProfile =
      role === "student"
        ? {
            id: user.studentId,
            firstName: user.firstName,
            lastName: user.lastName,
            program: user.program,
            year: user.year,
            section: user.section,
            type: user.type || "Regular",       // ADDED THIS
            status: user.status || "Enrolled",  // ADDED THIS
            email: user.email,
            gender: user.gender,
            address: user.address,
            birthdate: user.birthdate,
            age: user.age,
          }
        : {
            id: user.facultyId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          };

    res.json({ token, role, user: userProfile });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

module.exports = { login };