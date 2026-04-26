// controllers/postController.js
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// ── Helper ────────────────────────────────────────────────
const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
};

// ── GET /api/posts/:subjectId ─────────────────────────────
// Fetch all posts for a specific subject (schedule entry)
const getPostsBySubject = async (req, res) => {
  try {
    const db        = getDB();
    const subjectId = req.params.subjectId;

    console.log("GET posts for subjectId:", subjectId);

    const objId = toObjectId(subjectId);

    // Query both ObjectId and string forms
    const query = objId
      ? { $or: [{ subjectId: objId }, { subjectId: subjectId }] }
      : { subjectId: subjectId };

    const posts = await db
      .collection("posts")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(posts);
  } catch (err) {
    console.error("❌ getPostsBySubject error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── POST /api/posts ───────────────────────────────────────
// Create a new post
const createPost = async (req, res) => {
  try {
    const db   = getDB();
    const body = req.body;

    console.log("Creating post:", JSON.stringify(body, null, 2));

    if (!body.title?.trim() || !body.content?.trim()) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    if (!body.subjectId) {
      return res.status(400).json({ message: "subjectId is required." });
    }

    // Store subjectId as ObjectId if valid, else string
    const subjectObjId = toObjectId(body.subjectId);

    const doc = {
      title:       body.title.trim(),
      content:     body.content.trim(),
      type:        body.type ?? "announcement",
      subjectId:   subjectObjId ?? body.subjectId,
      author:      body.author ?? "Instructor",
      attachments: Array.isArray(body.attachments) ? body.attachments : [],
      likes:       0,
      createdAt:   new Date(),
      updatedAt:   new Date(),
    };

    const result = await db.collection("posts").insertOne(doc);

    const saved = { ...doc, _id: result.insertedId };

    console.log("Post created:", result.insertedId);
    res.status(201).json(saved);
  } catch (err) {
    console.error("createPost error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── PUT /api/posts/:id ────────────────────────────────────
// Update a post (title, content, type)
const updatePost = async (req, res) => {
  try {
    const db  = getDB();
    const id  = req.params.id;
    const objId = toObjectId(id);

    if (!objId) {
      return res.status(400).json({ message: "Invalid post ID." });
    }

    const body = req.body;
    const updates = {};

    if (body.title)   updates.title   = body.title.trim();
    if (body.content) updates.content = body.content.trim();
    if (body.type)    updates.type    = body.type;
    updates.updatedAt = new Date();

    const result = await db.collection("posts").findOneAndUpdate(
      { _id: objId },
      { $set: updates },
      { returnDocument: "after" },
    );

    if (!result) {
      return res.status(404).json({ message: "Post not found." });
    }

    console.log("Post updated:", id);
    res.json(result);
  } catch (err) {
    console.error("❌ updatePost error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── DELETE /api/posts/:id ─────────────────────────────────
// Delete a post by its _id
const deletePost = async (req, res) => {
  try {
    const db    = getDB();
    const id    = req.params.id;
    const objId = toObjectId(id);

    if (!objId) {
      return res.status(400).json({ message: "Invalid post ID." });
    }

    const result = await db.collection("posts").deleteOne({ _id: objId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Post not found." });
    }

    console.log("Post deleted:", id);
    res.json({ message: "Post deleted successfully.", id });
  } catch (err) {
    console.error("❌ deletePost error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── PATCH /api/posts/:id/like ─────────────────────────────
// Increment likes on a post
const likePost = async (req, res) => {
  try {
    const db    = getDB();
    const objId = toObjectId(req.params.id);

    if (!objId) {
      return res.status(400).json({ message: "Invalid post ID." });
    }

    const result = await db.collection("posts").findOneAndUpdate(
      { _id: objId },
      { $inc: { likes: 1 }, $set: { updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    if (!result) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.json({ likes: result.likes });
  } catch (err) {
    console.error("likePost error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

module.exports = { getPostsBySubject, createPost, updatePost, deletePost, likePost };