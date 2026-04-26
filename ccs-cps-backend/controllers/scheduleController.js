const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const dayName = (i) => DAYS[i] ?? `Day ${i}`;

// ── TIME OVERLAP FUNCTION ─────────────────────────────────────
const hasOverlap = (startA, spanA, startB, spanB) => {
  return startA < startB + spanB && startA + spanA > startB;
};

// ── CONFLICT CHECKER ─────────────────────────────────────────
const checkConflicts = async (
  db,
  { day, start, span, sub, facultyId, room },
  excludeId = null,
) => {
  const dayNum = Number(day);
  const newStart = Number(start);
  const newSpan = Number(span);

  const schedules = await db
    .collection("schedules")
    .find({ day: dayNum })
    .toArray();

  const conflicts = [];

  for (const ex of schedules) {
    if (excludeId && ex._id.toString() === excludeId.toString()) continue;

    const exStart = Number(ex.start);
    const exSpan = Number(ex.span);

    const overlap = hasOverlap(newStart, newSpan, exStart, exSpan);
    if (!overlap) continue;

    // ── FACULTY RULE (STRICT BLOCK) ───────────────────────────
    const sameFaculty = ex.facultyId?.toString() === facultyId?.toString();

    if (sameFaculty) {
      conflicts.push({
        type: "faculty",
        message: `${ex.facultyName} already has a class "${ex.title}" on ${dayName(dayNum)} at this time.`,
      });
    }

    // ── SECTION RULE ─────────────────────────────────────────
    if (ex.sub === sub) {
      conflicts.push({
        type: "section",
        message: `Section ${sub} already has "${ex.title}" on ${dayName(dayNum)} at this time.`,
      });
    }

    // ── ROOM RULE ────────────────────────────────────────────
    if (
      room?.trim() &&
      ex.room?.trim() &&
      ex.room.trim().toLowerCase() === room.trim().toLowerCase()
    ) {
      conflicts.push({
        type: "room",
        message: `Room ${ex.room} is already in use for "${ex.title}" on ${dayName(dayNum)} at this time.`,
      });
    }
  }

  return conflicts;
};

// ── ADD SCHEDULE ─────────────────────────────────────────────
const addSchedule = async (req, res) => {
  try {
    const db = getDB();
    const body = req.body;

    console.log("REQUEST:", body);

    const facultyObjId = toObjectId(body.facultyId);
    if (!facultyObjId) {
      return res.status(400).json({ message: "Invalid facultyId." });
    }

    const conflicts = await checkConflicts(db, {
      day: body.day,
      start: body.start,
      span: body.span,
      sub: body.sub,
      facultyId: body.facultyId,
      room: body.room,
    });

    if (conflicts.length > 0) {
      return res.status(409).json({
        message: "Schedule conflict detected.",
        conflicts,
      });
    }

    const doc = {
      day: Number(body.day),
      start: Number(body.start),
      span: Number(body.span),
      title: body.title,
      subjectCode: body.subjectCode,
      sub: body.sub,
      room: body.room,
      type: body.type,
      program: body.program,
      year: body.year,
      section: body.section,
      facultyId: facultyObjId,
      facultyName: body.facultyName,
      createdAt: new Date(),
    };

    const result = await db.collection("schedules").insertOne(doc);

    res.status(201).json({
      message: "Schedule saved successfully.",
      _id: result.insertedId,
      ...doc,
      facultyId: facultyObjId.toString(),
    });
  } catch (err) {
    console.error("addSchedule error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── GET BY FACULTY ───────────────────────────────────────────
const getSchedulesByFaculty = async (req, res) => {
  try {
    const db = getDB();
    const { facultyId } = req.params;

    const objId = toObjectId(facultyId);

    const query = objId ? { facultyId: objId } : { facultyId };

    const schedules = await db.collection("schedules").find(query).toArray();

    res.json(
      schedules.map((s) => ({
        ...s,
        facultyId: s.facultyId?.toString?.() ?? s.facultyId,
      })),
    );
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// ── GET ALL ───────────────────────────────────────────────────
const getAllSchedules = async (req, res) => {
  try {
    const db = getDB();
    const schedules = await db.collection("schedules").find({}).toArray();

    res.json(
      schedules.map((s) => ({
        ...s,
        facultyId: s.facultyId?.toString?.() ?? s.facultyId,
      })),
    );
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

// ── DELETE ────────────────────────────────────────────────────
const deleteSchedule = async (req, res) => {
  try {
    const db = getDB();
    const objId = toObjectId(req.params.id);

    if (!objId) {
      return res.status(400).json({ message: "Invalid id." });
    }

    const result = await db.collection("schedules").deleteOne({ _id: objId });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "Not found." });
    }

    res.json({ message: "Deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  addSchedule,
  getSchedulesByFaculty,
  getAllSchedules,
  deleteSchedule,
};
