const util = require('util');
const fs = require('fs');

const uuid = require('uuid')

const readAsync = util.promisify(fs.readFile);
const writeAsync = util.promisify(fs.writeFile);

class Save {
    read() {
        return readAsync('db/db.json', 'utf8');
    }

    write(notes) {
        return writeAsync('db/db.json', JSON.stringify(notes, null, 2));
    }

    getNotes() {
        return this.read().then((notes) => {
            let parsedNotes;

            try {
                parsedNotes = [].concat(JSON.parse(notes));
            }  catch (err) {
                parsedNotes = [];
            }

            return parsedNotes;
        });
    }

    addNote(note) {
        const { title, text } = note;

        if (!title || !text) {
            throw new Error('Neither the title or text fields can be blank');
        }

        const newNote = { title, text, id: uuid() };

        return this.getNotes()
        .then((notes) => [...notes, newNote])
        .then((updated) => this.write(updated))
        .then(() => newNote);
    }

    removeNote(id) {
        return this.getNotes()
        .then((notes) => notes.filter((note) => note.id !== id))
        .then((filtered) => this.write(filtered));
    }
}

module.exports = new Save();