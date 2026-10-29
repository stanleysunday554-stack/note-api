const Note = require('../models/Note');
const mongoose = require('mongoose');

// get all notes
function normalizeQueryTags(value) {
  const values = Array.isArray(value) ? value : [value];

  return values
    .flatMap(item => typeof item === "string" ? item.split(",") : [])
    .map(item => item.trim())
    .filter(Boolean);
}

const getNotes= async (req, res) => {
  try {
    const queryTags = normalizeQueryTags(req.query.tag ?? req.query.tags);
    const filter = {};

    if (queryTags.length > 0) {
      filter.tags = { $in: queryTags };
    }

    const notes = await Note.find(filter);

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}
    
// create a note
const createNote =  async (req, res, next) => {
  try {
    const { title, content, tags = [] } = req.body;

    const note = await Note.create({ title, content, tags }
      
    );

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

// get one note
const getNoteById =  async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

// put - replace the whole note

const replaceNote = async (req, res) => {
 try {
  const { title, content, tags = [] } = req.body;
  const id = req.params.id;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid note ID" });
  }
const update = { title, content, tags };
  const note = await Note.findByIdAndUpdate(id, update, {new
    : true,
    runValidators: true
  } )

  if (!note) {
    return res.status(404).json({ 
      success: false,
      message: "Note not found" });
  }
  res.status(200).json({
    success: true,
    data: note
  });
 } catch (error) {
  return res.status(500).json({
    success: false,
    message: "Server error",
    error: error.message
  });
 }
}

// patch - update only the field provided
const updateNote = async (req, res) => {
try {
  const { title, content, tags } = req.body;
const id = req.params.id;
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid note ID" });
  }

const update = {};
  if (title !== undefined) update.title = title;
  if (content !== undefined) update.content = content;
  if (tags !== undefined) update.tags = tags;

  const note = await Note.findByIdAndUpdate(id, update, { new: true, runValidators: true });

if(!note) {
  return res.status(404).json({ 
    success: false,
    message: "Note not found" });
}
res.status(200).json({
  success: true,
  data: note
});
} catch (error) {
  return res.status(500).json({
    success: false,
    message: "Server error",
    error: error.message
  });
}
}

// delete a note
const deleteNote = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}

module.exports = {
  getNotes,
  createNote,
    getNoteById,
    replaceNote,
    updateNote,
    deleteNote
};
