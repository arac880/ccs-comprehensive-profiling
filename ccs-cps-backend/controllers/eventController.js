const { getDB } = require("../config/db");
const jwt = require("jsonwebtoken");

const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const TYPE_ICONS = {
  Meeting: "bi-people-fill",
  Event: "bi-stars",
  Deadline: "bi-exclamation-circle-fill",
  Academic: "bi-mortarboard-fill",
  Assembly: "bi-megaphone-fill",
};

// 🔥 GET EVENTS (MONGO CLIENT - SAME AS LOGIN)
const getEvents = async (req, res) => {
  try {
    const db = getDB();

    const events = await db.collection("events").find({}).toArray();

    return res.status(200).json(events);
  } catch (err) {
    console.error("GET EVENTS ERROR:", err);
    return res.status(500).json({
      message: "Failed to fetch events",
      error: err.message,
    });
  }
};

// 🔥 CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!["dean", "chair"].includes(decoded.role)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { title, description, date, time, location, type, driveLink } = req.body;

    if (!title || !date || !type) {
      return res.status(400).json({ message: "Missing fields." });
    }

    const dateObj = new Date(date);

    const newEvent = {
      title: title.trim(),
      description: description || "",
      date: dateObj,
      day: dateObj.getDate(),
      month: MONTH_NAMES[dateObj.getMonth()],
      year: dateObj.getFullYear(),
      time: time || "All Day",
      location: location || "TBA",
      type,
      icon: TYPE_ICONS[type] || "bi-calendar-event-fill",
      driveLink: driveLink || "",
      createdBy: decoded.id,
      createdAt: new Date(),
    };

    const db = getDB();

    await db.collection("events").insertOne(newEvent);

    return res.status(201).json(newEvent);
  } catch (err) {
    console.error("CREATE EVENT ERROR:", err);
    return res.status(500).json({
      message: "Failed to create event",
      error: err.message,
    });
  }
};

module.exports = { getEvents, createEvent };
