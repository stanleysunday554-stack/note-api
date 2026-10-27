
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const notesRouter = require("./route/Notes");

app.use(morgan(":method :url :status :date[iso]"));

app.use("/notes", notesRouter);


// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
