const express = require("express");
const router = express.Router();
const {
  getStudents,
  addStudent,
  getStudentById,
  updateStudent,
  deleteStudent, // ✅ added
  addViolation,
  deleteViolation,
  changePassword,
} = require("../controllers/studentController");

// GET    /api/students                       → all students
router.get("/", getStudents);

// POST   /api/students                       → add new student
router.post("/", addStudent);

// GET    /api/students/:id                   → single student profile
router.get("/:id", getStudentById);

// PUT    /api/students/:id                   → update student profile fields
router.put("/:id", updateStudent);

// DELETE /api/students/:id                   → delete a student
router.delete("/:id", deleteStudent);

// POST   /api/students/:id/violations        → add a violation
router.post("/:id/violations", addViolation);

// DELETE /api/students/:id/violations/:index → remove a violation by index
router.delete("/:id/violations/:index", deleteViolation);

router.patch("/:id/change-password", changePassword);

module.exports = router;
