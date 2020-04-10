const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

let notesArray = [];

app.get("/api/notes", (err, res) => {
    try {
        notesArray = fs.readFileSync("./db/db.json", "utf8");
        notesArray = JSON.parse(notesArray);
    } catch (err) {
        throw err;
    }
    res.json(notesArray);
});

app.post("/api/notes", (req, res) => {
    try {
        notesArray = fs.readFileSync("./db/db.json", "utf8");
        notesArray = JSON.parse(notesArray);
        req.body.id = notesArray.length;
        notesArray.push(req.body);
        notesArray = JSON.stringify(notesArray);

        fs.writeFile("./db/db.json", notesArray, "utf8", (err) => {
            if (err) {
                throw err;
            }
        });
        res.json(JSON.parse(notesArray));

    } catch (err) {
        throw err;
    }
});

app.delete("/api/notes/:id", function (req, res) {
    try {
        notesArray = fs.readFileSync("./db/db.json", "utf8");
        notesArray = JSON.parse(notesArray);
        notesArray = notesArray.filter(function (note) {
            return note.id != req.params.id;
        });
        notesArray = JSON.stringify(notesArray);

        fs.writeFile("./db/db.json", notesArray, "utf8", function (err) {
            if (err) {
                throw err;
            }
        });

        res.send(JSON.parse(notesArray));

    } catch (err) {
        throw err;
    }
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
    console.log(`App listening to PORT: ${PORT}`);
});