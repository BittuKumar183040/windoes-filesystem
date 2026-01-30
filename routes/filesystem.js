import express from 'express';
import * as fileSystemRepo from '../service/repo/filesystemRepo.js';
import * as errorCheckService from '../service/errorCheckService.js';

const router = express.Router();

// Get root folders (C:, D:)
router.get('/', async (req, res, next) => {
  try {
    const roots = await fileSystemRepo.getFileSystemRoots();
    res.json(roots);
  } catch (err) {
    next(err);
  }
});

// Get contents of a specific folder
router.get('/:parentId', async (req, res, next) => {
  try {
    const { parentId } = req.params;
    const contents = await fileSystemRepo.getFolderContents(parentId);
    res.json(contents);
  } catch (err) {
    next(err);
  }
});

// Create a new folder
router.post('/folder', async (req, res, next) => {
  try {
    const { parentId, name, userId } = req.body;
    errorCheckService.checkParameters({ parentId, name, userId });
    const newFolder = await fileSystemRepo.createFolder({ parentId, name, userId });
    res.status(201).json(newFolder);
  } catch (err) {
    next(err);
  }
});

// Create a new file
router.post('/file', async (req, res, next) => {
  try {
    const { parentId, name, userId, size } = req.body;
    errorCheckService.checkParameters({ parentId, name, userId, size });
    const newFile = await fileSystemRepo.createFile({ parentId, name, userId, size });
    res.status(201).json(newFile);
  } catch (err) {
    next(err);
  }
});

// Rename a file or folder
router.put('/:id/rename', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;
    errorCheckService.checkParameters({ newName });
    const updatedItem = await fileSystemRepo.renameFileSystemItem(id, newName);
    res.json(updatedItem);
  } catch (err) {
    next(err);
  }
});

// Delete a file or folder
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await fileSystemRepo.deleteFileSystemItem(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;