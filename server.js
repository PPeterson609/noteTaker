const express = require("express");
const fs = requre("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;


//HTML Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });
  
  app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

  //API Routes
  app.get("/notes", (req,res) => {
    fs.readFile("./db/db.json", "utf8", (err,data) => {
        if (err) throw err; 
        res.json(JSON.parse(data));
  });
  });

  app.post("/api/notes", (req,res) => {
    const newNote = { id: uuidv4(), ...req.body };
    fs.readFile("./db/db.json", "utf8", (err,data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote); 
        fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json(newNote);
        });
    });
  });

  app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error reading data" });
      }
      const notes = JSON.parse(data);
      const filteredNotes = notes.filter((note) => note.id !== noteId);
      fs.writeFile("./db/db.json", JSON.stringify(filteredNotes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error writing data" });
        }
        res.json({ message: "Note deleted successfully" });
      });
    });
  });

  //start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });