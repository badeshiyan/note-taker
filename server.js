// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
const { notStrictEqual } = require("assert");

const { v4: uuidv4 } = require("uuid");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  storedNotes = fs.readFileSync("./db/db.json");
  storedNotes = JSON.parse(storedNotes);
  res.json(storedNotes);
});

app.post("/api/notes", function (req, res) {
  storedNotes = fs.readFileSync("./db/db.json");
  storedNotes = JSON.parse(storedNotes);
  req.body.id = uuidv4();
  storedNotes.push(req.body);
  storedNotes = JSON.stringify(storedNotes);
  fs.writeFileSync("./db/db.json", storedNotes);
  storedNotes = JSON.parse(storedNotes);
  res.json(storedNotes);
});

app.delete("/api/notes/:id", function (req, res) {
  storedNotes = fs.readFileSync("./db/db.json");
  storedNotes = JSON.parse(storedNotes);
  storedNotes = storedNotes.filter(function (note) {
    return note.id != req.params.id;
  });
  storedNotes = JSON.stringify(storedNotes);
  fs.writeFileSync("./db/db.json", storedNotes);
  storedNotes = JSON.parse(storedNotes);
  res.send(storedNotes);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
