// controllers/submissionController.js
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Storage config ────────────────────────────────────────
const uploadDir = path.join(__dirname, "../uploads/submissions");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

// Allow common file types
const fileFilter = (_req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
    "application/zip",
    "application/x-zip-compressed",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
};

// ── POST /api/submissions ─────────────────────────────────
// Student submits file(s) for an activity post
const createSubmission = async (req, res) => {
  try {
    const db = getDB();
    const body = req.body;

    if (!body.postId || !body.studentId) {
      // Clean uploaded files on validation fail
      (req.files || []).forEach((f) => fs.unlink(f.path, () => {}));
      return res
        .status(400)
        .json({ message: "postId and studentId are required." });
    }

    const postObjId = toObjectId(body.postId);
    if (!postObjId) {
      (req.files || []).forEach((f) => fs.unlink(f.path, () => {}));
      return res.status(400).json({ message: "Invalid postId." });
    }

    // Check that the post exists and is an activity
    const post = await db.collection("posts").findOne({ _id: postObjId });
    if (!post) {
      (req.files || []).forEach((f) => fs.unlink(f.path, () => {}));
      return res.status(404).json({ message: "Activity post not found." });
    }
    if (post.type !== "activity") {
      (req.files || []).forEach((f) => fs.unlink(f.path, () => {}));
      return res
        .status(400)
        .json({ message: "Submissions are only allowed for activity posts." });
    }

    // Check if student already submitted — update instead
    const existing = await db.collection("submissions").findOne({
      postId: postObjId,
      studentId: body.studentId,
    });

    const files = (req.files || []).map((f) => ({
      originalName: f.originalname,
      storedName: f.filename,
      size: `${(f.size / 1024).toFixed(0)} KB`,
      mimetype: f.mimetype,
      url: `/uploads/submissions/${f.filename}`,
    }));

    if (existing) {
      // Append new files to existing submission
      const updated = await db.collection("submissions").findOneAndUpdate(
        { _id: existing._id },
        {
          $push: { files: { $each: files } },
          $set: { updatedAt: new Date(), status: "submitted" },
        },
        { returnDocument: "after" },
      );
      return res.json(updated);
    }

    const doc = {
      postId: postObjId,
      studentId: body.studentId,
      studentName: body.studentName ?? "Student",
      files,
      status: "submitted", // submitted | graded | returned
      grade: null,
      feedback: null,
      submittedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("submissions").insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) {
    console.error("❌ createSubmission error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── GET /api/submissions/post/:postId ─────────────────────
// Faculty: get all submissions for a post
const getSubmissionsByPost = async (req, res) => {
  try {
    const db = getDB();
    const postObjId = toObjectId(req.params.postId);

    if (!postObjId) return res.status(400).json({ message: "Invalid postId." });

    const submissions = await db
      .collection("submissions")
      .find({ postId: postObjId })
      .sort({ submittedAt: -1 })
      .toArray();

    res.json(submissions);
  } catch (err) {
    console.error("❌ getSubmissionsByPost error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── GET /api/submissions/student/:studentId/post/:postId ──
// Student: check their own submission for a specific post
const getStudentSubmission = async (req, res) => {
  try {
    const db = getDB();
    const postObjId = toObjectId(req.params.postId);

    if (!postObjId) return res.status(400).json({ message: "Invalid postId." });

    const submission = await db.collection("submissions").findOne({
      postId: postObjId,
      studentId: req.params.studentId,
    });

    // Return null if none found (not 404 — front-end checks for null)
    res.json(submission ?? null);
  } catch (err) {
    console.error("❌ getStudentSubmission error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── DELETE /api/submissions/:id/file/:fileIndex ───────────
// Student removes a specific file from their submission
const removeSubmissionFile = async (req, res) => {
  try {
    const db = getDB();
    const objId = toObjectId(req.params.id);

    if (!objId)
      return res.status(400).json({ message: "Invalid submission ID." });

    const sub = await db.collection("submissions").findOne({ _id: objId });
    if (!sub) return res.status(404).json({ message: "Submission not found." });

    const idx = parseInt(req.params.fileIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= sub.files.length)
      return res.status(400).json({ message: "Invalid file index." });

    // Delete the physical file
    const filePath = path.join(uploadDir, sub.files[idx].storedName);
    if (fs.existsSync(filePath)) fs.unlink(filePath, () => {});

    const newFiles = sub.files.filter((_, i) => i !== idx);

    const updated = await db
      .collection("submissions")
      .findOneAndUpdate(
        { _id: objId },
        { $set: { files: newFiles, updatedAt: new Date() } },
        { returnDocument: "after" },
      );

    res.json(updated);
  } catch (err) {
    console.error("❌ removeSubmissionFile error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── PATCH /api/submissions/:id/grade ─────────────────────
// Faculty: grade / give feedback on a submission
const gradeSubmission = async (req, res) => {
  try {
    const db = getDB();
    const objId = toObjectId(req.params.id);

    if (!objId)
      return res.status(400).json({ message: "Invalid submission ID." });

    const { grade, feedback } = req.body;

    const updated = await db.collection("submissions").findOneAndUpdate(
      { _id: objId },
      {
        $set: {
          grade: grade ?? null,
          feedback: feedback ?? null,
          status: "graded",
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!updated)
      return res.status(404).json({ message: "Submission not found." });

    res.json(updated);
  } catch (err) {
    console.error("❌ gradeSubmission error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

module.exports = {
  upload,
  createSubmission,
  getSubmissionsByPost,
  getStudentSubmission,
  removeSubmissionFile,
  gradeSubmission,
};
