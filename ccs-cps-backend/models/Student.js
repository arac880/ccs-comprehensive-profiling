const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  birthdate: String,
  age: String,
  gender: String,
  address: String,
  program: String,
  year: String,
  section: String,
  email: String,
  status: String,
  password: { type: String, default: null },
  role: { type: String, default: "student" },
});

module.exports = mongoose.model("Student", studentSchema, "students");
