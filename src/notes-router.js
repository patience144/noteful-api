const express = require('express');
const NotesRouter = express.Router();
const NotesService = require('./notes-service')
const { v4: uuid } = require('uuid');

NotesRouter.route('/notes')
  .get((req, res, next) => {
    const db = req.app.get('db');
    NotesService.getNotes(db)
    .then(notes => {
      notes = notes.map(note => {
        note.name = note.note_name;
        note.modified = note.date_modified;
        note.content = note.note_content;
        note.folderId = note.folder_id;
        ['note_name', 'date_modified', 'note_content', 'folder_id']
          .forEach(key => delete note[key])
        return note;
      });
      return res.json(notes)
    })
      .catch(next);
  })
  .post((req, res, next) => {
    const db = req.app.get('db');
    const { name: note_name,content: note_content, folderId: folder_id, modified: date_modified } = req.body;
    const id = uuid();
    const note = {id, note_name, note_content, folder_id, date_modified}
    Object.entries(note).forEach((value, _) => {
      if (!value) res.status(400).json({
        error: 'Missing or invalid data.'
      });
    });
    NotesService.addNote(db, note)
      .then(note => {
        note.name = note.note_name;
        note.modified = note.date_modified;
        note.content = note.note_content;
        note.folderId = note.folder_id;
        ['note_name', 'date_modified', 'note_content', 'folder_id']
          .forEach(key => delete note[key])
        res.status(201).json(note)
      })
      .catch(next);
  });

NotesRouter.route('/notes/:noteID')
  .all((req, _, next) => {
    const db = req.app.get('db');
    const id = req.params.noteID;
    NotesService.getById(db, id)
      .then(note => {
        if (!note) next({message: 'Invalid data.'});
        next();
      });
  })
  .patch((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.noteID;
    const { name: note_name, content: note_content, folderId: folder_id, modified: date_modified } = req.body;
    const changes = { note_name, note_content, folderId, date_modified }
    Object.entries(changes).forEach((value, key) => {
      if (!value) delete changes[key];
    });
    NotesService.editNote(db, id, changes)
      .then(note => res.status(201).json(note))
      .catch(next);
  })
  .delete((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.noteID;
    NotesService.deleteNote(db, id)
      .then(() => res.status(201).end())
      .catch(next);
  }); 

module.exports = NotesRouter;