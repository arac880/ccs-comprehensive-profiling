const express = require("express");
const router = express.Router();
const { getStudents, addStudent } = require("../controllers/studentController");

// When a GET request hits /api/students, run getStudents
router.get("/", getStudents);

// When a POST request hits /api/students, run addStudent
router.post("/", addStudent);

module.exports = router;
