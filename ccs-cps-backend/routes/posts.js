// routes/posts.js
const express = require("express");
const router  = express.Router();
const {
  getPostsBySubject,
  createPost,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/postController");

// ── Health check ──────────────────────────────────────────
// GET /api/posts/ping → { ok: true }
router.get("/ping", (_req, res) => {
  res.json({ ok: true, message: "Posts router is alive ✅" });
});

// ── CRUD ──────────────────────────────────────────────────

// GET  /api/posts/:subjectId  — all posts for a subject
router.get("/:subjectId", getPostsBySubject);

// POST /api/posts             — create new post
router.post("/", createPost);

// PUT  /api/posts/:id         — update a post
router.put("/:id", updatePost);

// DELETE /api/posts/:id       — delete a post
router.delete("/:id", deletePost);

// PATCH /api/posts/:id/like   — like a post
router.patch("/:id/like", likePost);

module.exports = router;