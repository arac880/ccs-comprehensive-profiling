const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  date: { type: Date, required: true },
  day: Number,
  month: String,
  year: Number,
  time: { type: String, default: "All Day" },
  location: { type: String, default: "TBA" },
  type: {
    type: String,
    enum: ["Meeting", "Event", "Deadline", "Academic", "Assembly"],
  },
  icon: { type: String, default: "bi-calendar-event-fill" },
  createdAt: { type: Date, default: Date.now },
});

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

  events: { type: [eventSchema], default: [] },
});

module.exports = mongoose.model("Faculty", facultySchema, "faculty");
