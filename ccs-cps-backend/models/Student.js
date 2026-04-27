const mongoose = require("mongoose");

const courseRecordSchema = new mongoose.Schema(
  {
    schoolYear: { type: String },
    yearLevel: { type: String },
    semester: { type: String },
    section: { type: String },
    courseCode: { type: String },
    courseName: { type: String },
    units: { type: Number },
    grade: { type: String },
    remarks: { type: String },
  },
  { _id: false },
);

const violationSchema = new mongoose.Schema(
  {
    description: { type: String },
    date: { type: String },
    severity: { type: String, enum: ["Minor", "Major"], default: "Minor" },
    recordedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "" },
  },
  { _id: false },
);

const organizationSchema = new mongoose.Schema(
  {
    orgName: { type: String, required: true },
    memberType: { type: String, default: "" },
    membershipDate: { type: String, default: "" },
  },
  { _id: false },
);

const sportSchema = new mongoose.Schema(
  {
    sportName: { type: String, required: true },
    position: { type: String, default: "" },
    level: { type: String, default: "" },
  },
  { _id: false },
);

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "" },
    date: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  firstName: String,
  middleName: String,
  lastName: String,
  birthdate: String,
  age: String,
  gender: String,
  nationality: String,
  religion: String,
  civilStatus: String,
  placeOfBirth: String,
  residency: String,
  address: String,
  contactNumber: String,
  program: String,
  year: String,
  section: String,
  email: String,
  type: { type: String, default: "Regular" },
  status: { type: String, default: "Enrolled" },

  motherName: String,
  motherOccupation: String,
  motherContact: String,
  motherEmail: String,
  fatherName: String,
  fatherOccupation: String,
  fatherContact: String,
  fatherEmail: String,
  guardianName: String,
  guardianOccupation: String,
  guardianContact: String,
  guardianEmail: String,

  academicHistory: { type: [courseRecordSchema], default: [] },
  violations: { type: [violationSchema], default: [] },
  skills: { type: [skillSchema], default: [] },
  activities: { type: [activitySchema], default: [] },
  organizations: { type: [organizationSchema], default: [] },
  sports: { type: [sportSchema], default: [] },

  clearance: {
    type: Object,
    default: {},
  },

  password: { type: String, default: null },
  role: { type: String, default: "student" },
});

module.exports = mongoose.model("Student", studentSchema, "students");
