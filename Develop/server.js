const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = 3001;
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
  const notes = JSON.parse(notesData);
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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
