const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ───────────────── UPLOAD SETUP ─────────────────
const uploadDir = path.join(__dirname, "../uploads/posts");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// ───────────────── HELPERS ─────────────────
const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
};

// ───────────────── GET BY SUBJECT ─────────────────
const getPostsBySubject = async (req, res) => {
  try {
    const db = getDB();

    const posts = await db
      .collection("posts")
      .find({ subjectId: req.params.subjectId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ───────────────── GET SINGLE POST ─────────────────
const getPostById = async (req, res) => {
  try {
    const db = getDB();
    const id = toObjectId(req.params.id);

    if (!id) return res.status(400).json({ message: "Invalid ID" });

    const post = await db.collection("posts").findOne({ _id: id });

    if (!post) return res.status(404).json({ message: "Not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ───────────────── CREATE POST ─────────────────
const createPost = async (req, res) => {
  try {
    const db = getDB();
    const body = req.body;

    if (!body.title || !body.content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const attachments = (req.files || []).map((f) => ({
      name: f.originalname,
      url: `/uploads/posts/${f.filename}`,
      size: `${(f.size / 1024).toFixed(0)} KB`,
    }));

    const doc = {
      title: body.title,
      content: body.content,
      type: body.type || "announcement",
      subjectId: body.subjectId,

      // ✅ AUTHOR FIXED
      author: body.author || "Unknown",

      attachments,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("posts").insertOne(doc);

    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ───────────────── UPDATE POST (FIXED 100%) ─────────────────
const updatePost = async (req, res) => {
  try {
    const db = getDB();
    const id = toObjectId(req.params.id);

    if (!id) return res.status(400).json({ message: "Invalid ID" });

    const body = req.body;

    // keep existing attachments
    let kept = [];
    if (body.keepAttachments) {
      try {
        kept = JSON.parse(body.keepAttachments);
      } catch {
        kept = [];
      }
    }

    // new uploaded files
    const newFiles = (req.files || []).map((f) => ({
      name: f.originalname,
      url: `/uploads/posts/${f.filename}`,
      size: `${(f.size / 1024).toFixed(0)} KB`,
    }));

    const updates = {
      title: body.title,
      content: body.content,

      // ✅ AUTHOR FIXED
      author: body.author || "Unknown",

      attachments: [...kept, ...newFiles],
      updatedAt: new Date(),
    };

    // ✅ SAFE UPDATE (NO result.value bug)
    await db.collection("posts").updateOne({ _id: id }, { $set: updates });

    const updated = await db.collection("posts").findOne({ _id: id });

    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ───────────────── DELETE POST ─────────────────
const deletePost = async (req, res) => {
  try {
    const db = getDB();
    const id = toObjectId(req.params.id);

    if (!id) return res.status(400).json({ message: "Invalid ID" });

    await db.collection("posts").deleteOne({ _id: id });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ───────────────── LIKE POST ─────────────────
const likePost = async (req, res) => {
  try {
    const db = getDB();
    const id = toObjectId(req.params.id);

    const result = await db
      .collection("posts")
      .findOneAndUpdate(
        { _id: id },
        { $inc: { likes: 1 } },
        { returnDocument: "after" },
      );

    res.json(result.value);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  upload,
  getPostsBySubject,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
};
