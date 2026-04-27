// models/Faculty.js
const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  time: { type: String, required: true },
});

const facultySchema = new mongoose.Schema(
  {
    facultyId: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["Dean", "Department Chair", "Secretary", "Faculty"],
      default: "Faculty",
    },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    birthdate: { type: String },
    gender: { type: String },
    age: { type: Number },
    address: { type: String },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String },
    officeLocation: { type: String },
    department: { type: String },
    status: {
      type: String,
      enum: ["Plantilla", "Contract of Service", "Contractual", "Part time"],
    },
    schedule: [scheduleSchema],
    yearsAsFaculty: { type: Number, default: 0 },
    yearsAsDean: { type: Number, default: 0 },
    yearsAsDepartmentChair: { type: Number, default: 0 },
    twoFAEnabled: { type: Boolean, default: false },
    lastPasswordChange: { type: String },

    // Auth fields (if faculty logs in directly)
    password: { type: String }, // hashed
  },
  { timestamps: true },
);

module.exports = mongoose.model("Faculty", facultySchema);
