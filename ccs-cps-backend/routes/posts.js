const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  deletePost,
  updatePost,
} = require("../controllers/postController");

router.post("/", createPost);
router.get("/:subjectId", getPosts);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

module.exports = router;
