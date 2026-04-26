// routes/schedule.js
const express = require("express");
const router = express.Router();
const { addSchedule } = require("../controllers/scheduleController");
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// ── Health check (test this first!) ───────────────────────
// GET http://localhost:5000/api/schedules/ping → { ok: true }
router.get("/ping", (_req, res) => {
  res.json({ ok: true, message: "Schedule router is alive ✅" });
});

// ── GET /api/schedules/faculty/:facultyId ─────────────────
router.get("/faculty/:facultyId", async (req, res) => {
  try {
    const db = getDB();
    const { facultyId } = req.params;

    console.log("🔍 Fetching schedules for facultyId:", facultyId);

    let objId = null;
    try {
      objId = new ObjectId(facultyId);
    } catch {
      console.log(
        "   ⚠️  facultyId is not a valid ObjectId, will try string only",
      );
    }

    // Build query: try ObjectId first (preferred), then string fallback
    const queries = [];
    if (objId) queries.push({ facultyId: objId });
    queries.push({ facultyId: facultyId }); // string match fallback

    // Run both queries and merge, deduplicating by _id
    const seen = new Set();
    const schedules = [];

    for (const query of queries) {
      const rows = await db.collection("schedules").find(query).toArray();
      for (const row of rows) {
        const key = row._id.toString();
        if (!seen.has(key)) {
          seen.add(key);
          schedules.push(row);
        }
      }
    }

    console.log(`✅ Returning ${schedules.length} schedule(s)`);
    res.json(schedules);
  } catch (err) {
    console.error("❌ GET /faculty/:facultyId error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// ── POST /api/schedules ───────────────────────────────────
router.post("/", addSchedule);

module.exports = router;
