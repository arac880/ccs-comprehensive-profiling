// controllers/scheduleController.js
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// ── Helper: safely parse facultyId into ObjectId ──────────
const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
};

// ── POST /api/schedules ───────────────────────────────────
const addSchedule = async (req, res) => {
  try {
    const db = getDB();
    const body = req.body;

    console.log("📥 Incoming schedule payload:", JSON.stringify(body, null, 2));

    // Always store facultyId as ObjectId so GET queries match reliably
    const facultyObjId = toObjectId(body.facultyId);
    if (!facultyObjId) {
      return res.status(400).json({ message: "Invalid facultyId format." });
    }

    const doc = {
      day: body.day,
      start: body.start,
      span: body.span,
      title: body.title,
      subjectCode: body.subjectCode,
      sub: body.sub,
      room: body.room,
      type: body.type,
      program: body.program,
      year: body.year,
      section: body.section,
      facultyId: facultyObjId, // stored as ObjectId
      facultyName: body.facultyName,
      createdAt: new Date(),
    };

    const result = await db.collection("schedules").insertOne(doc);

    console.log("✅ Schedule saved, insertedId:", result.insertedId);

    res.status(201).json({
      message: "Schedule saved successfully.",
      _id: result.insertedId,
      ...doc,
      facultyId: facultyObjId.toString(), // send back as string for frontend
    });
  } catch (err) {
    console.error("❌ addSchedule error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

module.exports = { addSchedule };
