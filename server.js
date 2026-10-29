const config = require("dotenv")


const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const notesRouter = require("./route/Notes");

config.config();

app.use(morgan(":method :url :status :date[iso]"));

const connectDB = require("./config/database");

app.use("/notes", notesRouter);


async function startServer() {
  try {
  await connectDB();
  const port = process.env.PORT ?? 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
  catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();