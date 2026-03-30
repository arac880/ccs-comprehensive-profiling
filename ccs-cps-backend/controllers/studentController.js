const { getDB } = require("../config/db");

// @desc    Get all students
// @route   GET /api/students
const getStudents = async (req, res) => {
  try {
    const db = getDB();
    // Fetch all documents from the "students" collection and turn them into an array
    const students = await db.collection("students").find({}).toArray();

    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch students", error: error.message });
  }
};

// @desc    Add a new student
// @route   POST /api/students
const addStudent = async (req, res) => {
  try {
    const db = getDB();
    const newStudent = req.body;
    // Example: { firstName: "Juan", lastName: "Dela Cruz", studentId: "2201001", ... }

    // Insert the data from your React modal into the "students" collection
    const result = await db.collection("students").insertOne(newStudent);

    res.status(201).json({
      message: "Student added successfully",
      studentId: result.insertedId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add student", error: error.message });
  }
};

module.exports = {
  getStudents,
  addStudent,
};
