const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    type: String,
    subjectId: String,
    author: String,
    attachments: [
      {
        name: String,
        size: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", PostSchema);
