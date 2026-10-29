function normalizeTags(tagsValue) {
  if (Array.isArray(tagsValue)) {
    return tagsValue
      .map(tag => String(tag).trim())
      .filter(Boolean);
  }

  if (typeof tagsValue === "string") {
    return tagsValue
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  return [];
}

// Middleware to check title and content
function checkNote(req, res, next) {
  const { title, content, tags, tag } = req.body;
  const normalizedTags = normalizeTags(tags ?? tag);

  if (!title || !title.trim() || !content || !content.trim()) {
    return res.status(400).json({
      message: "Title and content are required"
    });
  }

  if (tags !== undefined || tag !== undefined) {
    req.body.tags = normalizedTags;
    delete req.body.tag;
  }

  next();
}

module.exports = checkNote;