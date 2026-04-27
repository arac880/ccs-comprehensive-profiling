const express = require("express");
const router = express.Router();

const {
  upload,
  getPostsBySubject,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
} = require("../controllers/postController");

router.get("/ping", (_req, res) =>
  res.json({ ok: true, message: "Posts API OK ✅" }),
);

router.get("/subject/:subjectId", getPostsBySubject);
router.get("/:id", getPostById);

router.post("/", upload.array("attachments", 20), createPost);
router.put("/:id", upload.array("attachments", 20), updatePost);

router.delete("/:id", deletePost);
router.patch("/:id/like", likePost);

module.exports = router;
