const { getDB } = require("../config/db");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

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

// Helper: try to match _id as string first, then as ObjectId
async function findEventById(collection, id) {
  // 1. Try string match (new events created with Date.now().toString())
  let doc = await collection.findOne({ _id: id });
  if (doc) return { doc, matchedId: id };

  // 2. Try ObjectId match (legacy events inserted before the string-ID change)
  if (ObjectId.isValid(id)) {
    const oid = new ObjectId(id);
    doc = await collection.findOne({ _id: oid });
    if (doc) return { doc, matchedId: oid };
  }

  return { doc: null, matchedId: null };
}

// GET EVENTS
const getEvents = async (req, res) => {
  try {
    const db = getDB();
    const events = await db.collection("events").find({}).toArray();
    return res.status(200).json(events);
  } catch (err) {
    console.error("GET EVENTS ERROR:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch events", error: err.message });
  }
};

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!["dean", "chair"].includes(decoded.role))
      return res.status(403).json({ message: "Access denied." });

    const { title, description, date, time, location, type, driveLink } =
      req.body;

    if (!title || !date || !type)
      return res.status(400).json({ message: "Missing required fields." });

    const dateObj = new Date(date);

    const newEvent = {
      _id: Date.now().toString(),
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
    return res
      .status(500)
      .json({ message: "Failed to create event", error: err.message });
  }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!["dean", "chair"].includes(decoded.role))
      return res.status(403).json({ message: "Access denied." });

    const { id } = req.params;
    const { title, description, date, time, location, type, driveLink } =
      req.body;

    if (!title || !date || !type)
      return res.status(400).json({ message: "Missing required fields." });

    const dateObj = new Date(date);

    const updatedFields = {
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
      updatedAt: new Date(),
    };

    const db = getDB();
    const { doc, matchedId } = await findEventById(db.collection("events"), id);

    if (!doc) {
      return res.status(404).json({ message: "Event not found." });
    }

    // findOneAndUpdate — returnDocument: "after" returns the updated doc directly
    const updatedDoc = await db
      .collection("events")
      .findOneAndUpdate(
        { _id: matchedId },
        { $set: updatedFields },
        { returnDocument: "after" },
      );

    // MongoDB driver v5+ returns the doc directly (not wrapped in .value)
    const result = updatedDoc?.value ?? updatedDoc;

    return res.status(200).json(result);
  } catch (err) {
    console.error("UPDATE EVENT ERROR:", err);
    return res
      .status(500)
      .json({ message: "Failed to update event", error: err.message });
  }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!["dean", "chair"].includes(decoded.role))
      return res.status(403).json({ message: "Access denied." });

    const { id } = req.params;
    const db = getDB();
    const { matchedId } = await findEventById(db.collection("events"), id);

    if (!matchedId) {
      return res.status(404).json({ message: "Event not found." });
    }

    const result = await db.collection("events").deleteOne({ _id: matchedId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("DELETE EVENT ERROR:", err);
    return res
      .status(500)
      .json({ message: "Failed to delete event", error: err.message });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
