const Post = require("../models/Post");

// CREATE
exports.createPost = async (req, res) => {
  try {
    const { title, content, type, subjectId, author } = req.body;

    const post = await Post.create({
      title,
      content,
      type,
      subjectId,
      author,
      attachments: req.body.attachments || [],
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ subjectId: req.params.subjectId }).sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updatePost = async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
