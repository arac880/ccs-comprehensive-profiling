// routes/schedule.js
const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// ── Helper ────────────────────────────────────────────────────────────────────
const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
};

// ── Health check ──────────────────────────────────────────────────────────────
router.get("/ping", (_req, res) => {
  res.json({ ok: true, message: "Schedule router is alive " });
});

// ── GET /api/schedules/faculty/:facultyId ─────────────────────────────────────
// NOTE: This MUST be declared before any /:id route to avoid conflicts
router.get("/faculty/:facultyId", async (req, res) => {
  try {
    const db = getDB();
    const { facultyId } = req.params;

    console.log("🔍 GET /faculty/:facultyId called with:", facultyId);

    // Guard against bad values
    if (!facultyId || facultyId === "null" || facultyId === "undefined") {
      return res.status(400).json({ message: "Invalid or missing facultyId." });
    }

    const objId = toObjectId(facultyId);
    console.log(" Converted ObjectId:", objId);

    // Try both ObjectId and string to cover any inconsistency in stored data
    const seen = new Set();
    const schedules = [];

    const queries = [];
    if (objId) queries.push({ facultyId: objId });
    queries.push({ facultyId: facultyId }); // string fallback

    for (const query of queries) {
      const rows = await db.collection("schedules").find(query).toArray();
      console.log(`   Query ${JSON.stringify(query)} → ${rows.length} row(s)`);
      for (const row of rows) {
        const key = row._id.toString();
        if (!seen.has(key)) {
          seen.add(key);
          schedules.push({
            ...row,
            _id: row._id.toString(),
            facultyId: row.facultyId?.toString?.() ?? row.facultyId,
          });
        }
      }
    }

    console.log(` Returning ${schedules.length} schedule(s)`);
    res.json(schedules);
  } catch (err) {
    console.error(" GET /faculty/:facultyId error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// ── GET /api/schedules (all — for admin/dean/chair) ───────────────────────────
router.get("/", async (_req, res) => {
  try {
    const db = getDB();
    const schedules = await db.collection("schedules").find({}).toArray();
    const normalized = schedules.map((s) => ({
      ...s,
      _id: s._id.toString(),
      facultyId: s.facultyId?.toString?.() ?? s.facultyId,
    }));
    res.json(normalized);
  } catch (err) {
    console.error(" GET / error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// ── POST /api/schedules ───────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const body = req.body;

    console.log(" Incoming schedule payload:", JSON.stringify(body, null, 2));

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
      facultyId: facultyObjId, // stored as ObjectId in MongoDB
      facultyName: body.facultyName,
      createdAt: new Date(),
    };

    const result = await db.collection("schedules").insertOne(doc);
    console.log("Schedule saved, insertedId:", result.insertedId);

    res.status(201).json({
      message: "Schedule saved successfully.",
      _id: result.insertedId.toString(),
      ...doc,
      facultyId: facultyObjId.toString(), // send back as string
    });
  } catch (err) {
    console.error("❌ POST / error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// ── DELETE /api/schedules/:id ─────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const objId = toObjectId(req.params.id);
    if (!objId) {
      return res.status(400).json({ message: "Invalid schedule id." });
    }

    const result = await db.collection("schedules").deleteOne({ _id: objId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Schedule not found." });
    }
    res.json({ message: "Schedule deleted." });
  } catch (err) {
    console.error(" DELETE /:id error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;
