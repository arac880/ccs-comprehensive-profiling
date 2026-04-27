const { getDB } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { id, password } = req.body;

  try {
    const db = getDB();
    let user = null;
    let role = null;

    // Filter out deleted students
    user = await db.collection("students").findOne({
      studentId: id,
      isDeleted: { $ne: true },
    });

    if (user) role = "student";

    if (!user) {
      user = await db.collection("faculty").findOne({
        facultyId: id,
        isDeleted: { $ne: true },
      });

      if (user) {
        role = user.isDean
          ? "dean"
          : user.isChair
            ? "chair"
            : user.role === "dean" ||
                user.role === "chair" ||
                user.role === "faculty"
              ? user.role
              : "faculty";
      }
    }

    if (!user) {
      // If the student is soft-deleted, they hit this block
      return res
        .status(404)
        .json({ message: "Account not found or deactivated." });
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
            _id: user._id,
            id: user.studentId,
            firstName: user.firstName,
            lastName: user.lastName,
            program: user.program,
            year: user.year,
            section: user.section,
            type: user.type || "Regular",
            status: user.status || "Enrolled",
            isDeleted: user.isDeleted || false, //Pass this to the frontend
            email: user.email,
            gender: user.gender,
            address: user.address,
            birthdate: user.birthdate,
            age: user.age,
          }
        : {
            _id: user._id,
            id: user.facultyId,
            firstName: user.firstName,
            middleName: user.middleName || "",
            lastName: user.lastName,
            email: user.email,
            isDean: user.isDean || false,
            isChair: user.isChair || false,
            department: user.department || "",
          };

    res.json({ token, role, user: userProfile });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

module.exports = { login };
