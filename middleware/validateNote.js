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

module.exports = checkNote;