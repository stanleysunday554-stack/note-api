const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  tags: {
    type: [String],
    default: [],
  }
},
{
    timestamps: true,
}

);

module.exports = mongoose.model('Note', noteSchema);