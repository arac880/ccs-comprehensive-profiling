// routes/submissions.js
const express = require("express");
const router = express.Router();
const {
  upload,
  createSubmission,
  getSubmissionsByPost,
  getStudentSubmission,
  removeSubmissionFile,
  gradeSubmission,
} = require("../controllers/submissionController");

// ── Student: submit files for an activity ────────────────
// POST /api/submissions
// Body (multipart/form-data): postId, studentId, studentName, files[]
router.post("/", upload.array("files", 10), createSubmission);

// ── Faculty: view all submissions for a post ─────────────
// GET /api/submissions/post/:postId
router.get("/post/:postId", getSubmissionsByPost);

// ── Student: check own submission for a post ─────────────
// GET /api/submissions/student/:studentId/post/:postId
router.get("/student/:studentId/post/:postId", getStudentSubmission);

// ── Student: remove a file from their submission ─────────
// DELETE /api/submissions/:id/file/:fileIndex
router.delete("/:id/file/:fileIndex", removeSubmissionFile);

// ── Faculty: grade a submission ───────────────────────────
// PATCH /api/submissions/:id/grade
// Body: { grade, feedback }
router.patch("/:id/grade", gradeSubmission);

module.exports = router;
