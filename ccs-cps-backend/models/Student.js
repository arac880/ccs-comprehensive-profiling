const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  firstName: String,
  middleInitial: String, // ← ADD
  lastName: String,
  birthdate: String,
  age: String,
  gender: String,
  nationality: String, // ← ADD
  religion: String, // ← ADD
  civilStatus: String, // ← ADD
  placeOfBirth: String, // ← ADD
  residency: String, // ← ADD
  address: String,
  contactNumber: String, // ← ADD
  program: String,
  year: String,
  section: String,
  email: String,

  // ADDED THESE TWO:
  type: { type: String, default: "Regular" },
  status: { type: String, default: "Enrolled" },
  studentAssistantship: String, // ← ADD
  grantee: String, // ← ADD
  motherName: String, // ← ADD
  motherOccupation: String, // ← ADD
  motherContact: String, // ← ADD
  motherEmail: String, // ← ADD
  fatherName: String, // ← ADD
  fatherOccupation: String, // ← ADD
  fatherContact: String, // ← ADD
  fatherEmail: String, // ← ADD
  guardianName: String, // ← ADD
  guardianOccupation: String, // ← ADD
  guardianContact: String, // ← ADD
  guardianEmail: String, // ← ADD

  skills: { type: Array, default: [] },
  password: { type: String, default: null },
  role: { type: String, default: "student" },
});

module.exports = mongoose.model("Student", studentSchema, "students");
