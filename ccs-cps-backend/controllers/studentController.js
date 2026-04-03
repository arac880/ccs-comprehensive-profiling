const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

// @desc    Get all students
// @route   GET /api/students
const getStudents = async (req, res) => {
  try {
    const db = getDB();
    const students = await db.collection("students").find({}).toArray();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};

// @desc    Add a new student
// @route   POST /api/students
const addStudent = async (req, res) => {
  try {
    const db = getDB();
    
    // --- UPDATED: Use birthdate (YYYY-MM-DD) as the default password ---
    // If for some reason birthdate is missing, it falls back to studentId just to prevent a crash
    const defaultPasswordString = req.body.birthdate || req.body.studentId; 
    
    const salt = await bcrypt.genSalt(10);
    const defaultHashedPassword = await bcrypt.hash(defaultPasswordString, salt);

    const newStudent = {
      ...req.body,
      password: defaultHashedPassword, // Saves the hashed birthdate
      type: req.body.type || "Regular",
      status: req.body.status || "Enrolled",
      role: "student"
    };

    const result = await db.collection("students").insertOne(newStudent);
    res.status(201).json({
      message: "Student added successfully",
      studentId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add student", error: error.message });
  }
};

// @desc    Get a single student by MongoDB _id
// @route   GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const student = await db.collection("students").findOne({ _id: new ObjectId(id) });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student", error: error.message });
  }
};

// @desc    Update a student by MongoDB _id
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const { _id, ...updateData } = req.body;

    const result = await db.collection("students").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error: error.message });
  }
};

module.exports = {
  getStudents,
  addStudent,
  getStudentById,
  updateStudent,
};