const FolderService = {
  getFolders(db) {
    return db.from('folders')
      .select('*');
  }
  ,
  addFolder(db, folder) {
    return db.into('folders')
      .insert(folder)
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  }
  ,
  editFolder(db, id, values) {
    return db.from('folders')
      .select('*')
      .update(values)
      .where({id});
  }
  ,
  deleteFolder(db, id) {
    return db.from('folders')
      .delete()
      .where({id});
  }
  ,
  getById(db, id) {
    return db.from('folders')
      .select('*')
      .where({id})
      .first();
  }
};

module.exports = FolderService;