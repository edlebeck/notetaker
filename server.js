const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require('./db/db.json');
const exp = require('constants');
const fs = require('fs');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    notes.push(req.body);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes}, null, 2)
    );
    res.json(notes)
})

app.delete('/api/notes/:id', (req, res) => {
    let delTarget = parseInt(req.params.id);
    notes.splice(delTarget, 1)
    for (let i = 0; i < notes.length; i++) {
        notes[i].id = i
    }
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes}, null, 2)
    );

    res.json(notes);
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });