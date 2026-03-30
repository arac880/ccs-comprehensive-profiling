const express = require("express");
const router = express.Router();
const {
  getStudents,
  addStudent,
  getStudentById,
  updateStudent,
} = require("../controllers/studentController");

// GET  /api/students        → all students
router.get("/", getStudents);

// POST /api/students        → add new student
router.post("/", addStudent);

// GET  /api/students/:id    → single student profile
router.get("/:id", getStudentById);

// PUT  /api/students/:id    → update student profile
router.put("/:id", updateStudent);

module.exports = router;