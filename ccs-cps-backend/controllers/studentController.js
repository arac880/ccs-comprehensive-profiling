const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const getStudents = async (req, res) => {
  try {
    const db = getDB();
    const students = await db.collection("students").find({}).toArray();
    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch students", error: error.message });
  }
};

const addStudent = async (req, res) => {
  try {
    const db = getDB();
    const defaultPasswordString = req.body.birthdate || req.body.studentId;
    const salt = await bcrypt.genSalt(10);
    const defaultHashedPassword = await bcrypt.hash(
      defaultPasswordString,
      salt,
    );

    const newStudent = {
      ...req.body,
      password: defaultHashedPassword,
      type: req.body.type || "Regular",
      status: req.body.status || "Enrolled",
      role: "student",
      violations: [],
      academicHistory: [],
      skills: [],
      activities: [],
      organizations: [],
      sports: [],
    };

    const result = await db.collection("students").insertOne(newStudent);
    res
      .status(201)
      .json({
        message: "Student added successfully",
        studentId: result.insertedId,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add student", error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid student ID format" });
    const student = await db
      .collection("students")
      .findOne({ _id: new ObjectId(id) });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch student", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid student ID format" });

    const { _id, violations, academicHistory, password, role, ...updateData } =
      req.body;

    const result = await db
      .collection("students")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update student", error: error.message });
  }
};

// ── NEW: Delete student ──────────────────────────────────────
const deleteStudent = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const result = await db
      .collection("students")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete student", error: error.message });
  }
};
// ─────────────────────────────────────────────────────────────

const addViolation = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid student ID format" });

    const { description, date, severity } = req.body;
    if (!description || !date) {
      return res
        .status(400)
        .json({ message: "Description and date are required." });
    }

    const violation = {
      description,
      date,
      severity: severity || "Minor",
      recordedAt: new Date(),
    };

    const result = await db
      .collection("students")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $push: { violations: violation } },
        { returnDocument: "after" },
      );

    if (!result) return res.status(404).json({ message: "Student not found" });
    res
      .status(200)
      .json({ message: "Violation added", violations: result.violations });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add violation", error: error.message });
  }
};

const deleteViolation = async (req, res) => {
  try {
    const db = getDB();
    const { id, index } = req.params;
    const idx = parseInt(index);
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid student ID format" });
    if (isNaN(idx) || idx < 0)
      return res.status(400).json({ message: "Invalid violation index" });

    const student = await db
      .collection("students")
      .findOne({ _id: new ObjectId(id) });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const violations = Array.isArray(student.violations)
      ? [...student.violations]
      : [];
    if (idx >= violations.length)
      return res.status(400).json({ message: "Violation index out of range" });

    violations.splice(idx, 1);

    await db
      .collection("students")
      .updateOne({ _id: new ObjectId(id) }, { $set: { violations } });

    res.status(200).json({ message: "Violation removed", violations });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete violation", error: error.message });
  }
};

module.exports = {
  getStudents,
  addStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  addViolation,
  deleteViolation,
};
