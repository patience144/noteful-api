const express = require('express');
const FoldersRouter = express.Router();
const FoldersService = require('./folders-service')
const { v4: uuid } = require('uuid');

FoldersRouter.route('/folders')
  .get((req, res, next) => {
    const db = req.app.get('db');
    FoldersService.getFolders(db)
      .then(folders => {
        folders = folders.map(folder => {
          folder.name = folder['folder_name'];
          delete folder['folder_name'];
          return folder;
        })
        return res.json(folders)
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const db = req.app.get('db');
    const { name: folder_name } = req.body;
    const id = uuid();
    const folder = { id, folder_name }
    Object.entries(folder).forEach((value, _) => {
      if (!value) res.status(400).json({
        error: 'Missing or invalid data.'
      });
    });
    FoldersService.addFolder(db, folder)
      .then(folder => {
        folder.name = folder['folder_name'];
        delete folder['folder_name'];
        return res.json(folder);
      })
      .catch(next);
  });

FoldersRouter.route('/folders/:folderID')
  .patch((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.folderID;
    const { name: folder_name } = req.body;
    const changes = { folder_name }
    Object.entries(changes).forEach((key, value) => {
      if (!value) delete changes[key];
    });
    FoldersService.editFolder(db, id, changes)
      .then(folder => {
        folder.name = folder['folder_name'];
        delete folder['folder_name'];
        return res.status(201).json(folder)
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.folderID;
    FoldersService.deleteFolder(db, id)
      .then(() => res.status(201).end())
      .catch(next);
  }); 

module.exports = FoldersRouter;