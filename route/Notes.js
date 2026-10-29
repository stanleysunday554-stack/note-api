const express = require("express");

const mongoose = require("mongoose");

const router = express.Router();

const checkNote = require("../middleware/validateNote");
const {
  getNotes, createNote, updateNote, deleteNote, getNoteById, replaceNote
} = require("../controller/notecontroller");
const Note = require("../models/Note");





// GET all notes
router.get("/", getNotes);
  
// POST - Create a note
router.post("/", checkNote, createNote);



// GET one note
router.get("/:id", checkNote, getNoteById);



// PUT - Replace the whole note
router.put("/:id", checkNote, replaceNote);

// PATCH - Update only the field provided
router.patch("/:id",checkNote, updateNote);

// DELETE - Delete a note
router.delete("/:id", checkNote, deleteNote);

module.exports = router;
