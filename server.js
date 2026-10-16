
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(morgan(":method :url :status :date[iso]"));

// Notes array
let notes = [];

// Middleware to check title and content
function checkNote(req, res, next) {
  const { title, content } = req.body;

  if (!title || !title.trim() || !content || !content.trim()) {
    return res.status(400).json({
      message: "Title and content are required"
    });
  }

  next();
}

// GET all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// GET one note
app.get("/notes/:id", (req, res) => {
  const note = notes.find(n => n.id === Number(req.params.id));

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(note);
});

// POST - Create a note
app.post("/notes", checkNote, (req, res) => {
  const { title, content, tags } = req.body;

  if (
    !Array.isArray(tags) ||
    tags.length === 0 ||
    !tags.every(tag => ["study", "research"].includes(tag))
  ) {
    return res.status(400).json({
      message: "Tags must contain study or research"
    });
  }

  const now = new Date();

  const newNote = {
    id: Date.now(),
    title,
    content,
    tags,
    createdAt: now,
    updatedAt: now
  };

  notes.push(newNote);

  res.status(201).json(newNote);
});

// PUT - Replace the whole note
app.put("/notes/:id", checkNote, (req, res) => {
  const note = notes.find(n => n.id === Number(req.params.id));

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  const { title, content, tags } = req.body;

  if (
    !Array.isArray(tags) ||
    tags.length === 0 ||
    !tags.every(tag => ["study", "research"].includes(tag))
  ) {
    return res.status(400).json({
      message: "Tags must contain study or research"
    });
  }

  note.title = title;
  note.content = content;
  note.tags = tags;
  note.updatedAt = new Date();

  res.json(note);
});

// PATCH - Update only the field provided
app.patch("/notes/:id", (req, res) => {
  const note = notes.find(n => n.id === Number(req.params.id));

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  const { title, content, tags } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Invalid title" });
    }
    note.title = title;
  }

  if (content !== undefined) {
    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Invalid content" });
    }
    note.content = content;
  }

  if (tags !== undefined) {
    if (
      !Array.isArray(tags) ||
      tags.length === 0 ||
      !tags.every(tag => ["study", "research"].includes(tag))
    ) {
      return res.status(400).json({
        message: "Tags must contain study or research"
      });
    }
    note.tags = tags;
  }

  note.updatedAt = new Date();

  res.json(note);
});

// DELETE - Delete a note
app.delete("/notes/:id", (req, res) => {
  const index = notes.findIndex(n => n.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes.splice(index, 1);

  res.json({ message: "Note deleted successfully" });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
