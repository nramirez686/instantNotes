const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;
const notesData = require("./db/db.json");
console.log(notesData);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  const notesData = fs.readFileSync("./db/db.json", "utf8");
  let notes = JSON.parse(notesData);
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const notesData = fs.readFileSync("./db/db.json", "utf8");
  const notes = JSON.parse(notesData);

  //new note with a unique ID
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  //new note pushed
  notes.push(newNote);

  //add the updated notes back to the db.json file
  fs.writeFileSync("db/db.json", JSON.stringify(notes));

  //send new note as a response
  res.json(newNote);
});
//init the app
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.delete("/api/notes/:id", (req, res) => {
  const notesData = fs.readFileSync("./db/db.json", "utf8");
  let notes = JSON.parse(notesData);
  //added noteID from request params
  const noteId = req.params.id;
  //find the index based on ID
  const noteIndex = notes.findIndex((note) => note.id === noteId);
  // if statement indecating that note will be removed by its id
  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    fs.writeFileSync("db/db.json", JSON.stringify(notes));
    res.json({ message: "Note deleted successfully" });
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});
