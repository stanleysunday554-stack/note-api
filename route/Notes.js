const express = require("express");

const router = express.Router();

const checkNote = require("../middleware/validateNote");

let notes = [];


// GET all notes
router.get("/", (req, res) => {
  res.json(notes);
});

// GET one note
router.get("/:id", (req, res) => {
  const note = notes.find(n => n.id === Number(req.params.id));

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(note);
});

// POST - Create a note
router.post("/", checkNote, (req, res) => {
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
    id: notes.length + 1,
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
router.put("/:id", checkNote, (req, res) => {
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
router.patch("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  const index = notes.findIndex(n => n.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes.splice(index, 1);

  res.json({ message: "Note deleted successfully" });
});

module.exports = router;
