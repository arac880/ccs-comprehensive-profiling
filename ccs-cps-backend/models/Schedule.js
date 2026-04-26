const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  facultyId: String,
  day: Number,
  start: Number,
  span: Number,
  title: String,
  sub: String,
  room: String,
  type: String,
});

module.exports = mongoose.model("Schedule", scheduleSchema);
