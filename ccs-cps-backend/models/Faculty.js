const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  birthdate: String,
  email: String,
  password: { type: String, default: null },
  role: { type: String, default: "faculty" },
  isDean: { type: Boolean, default: false },
  isChair: { type: Boolean, default: false },
  department: { type: String },
});

module.exports = mongoose.model("Faculty", facultySchema, "faculty");
