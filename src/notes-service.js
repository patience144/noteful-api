const NotesService = {
  getNotes(db) {
    return db.from('notes')
      .select('*')
  }
  ,
  addNote(db, note) {
    return db.into('notes')
      .insert(note)
      .returning('*')
      .then(rows => rows[0])
  }
  ,
  editNote(db, id, values) {
    return db.from('notes')
      .select('*')
      .update(values)
      .where({id})
  }
  ,
  deleteNote(db, id) {
    return db.from('notes')
      .delete()
      .where({id})
  }
  ,
  getById(db, id) {
    return db.from('notes')
      .select('*')
      .where({id})
      .first();
  }
};

module.exports = NotesService;