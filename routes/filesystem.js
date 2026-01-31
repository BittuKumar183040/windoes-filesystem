import express from "express";
import path from 'path';
import * as fileSystemRepo from "../service/repo/filesystemRepo.js";
import * as errorCheckService from "../service/errorCheckService.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const userId = req.headers["userid"];
    errorCheckService.checkParameters({ userId });

    const fileSystem = await fileSystemRepo.getFullFileSystem(userId);

    res.json(fileSystem);
  } catch (err) {
    next(err);
  }
});

router.get("/folder", async (req, res, next) => {
  try {
    const userId = req.headers["userid"];
    const roots = await fileSystemRepo.getFileSystemRoots(userId);
    res.json(roots);
  } catch (err) {
    next(err);
  }
});

router.get("/folder/:parentId", async (req, res, next) => {
  try {
    const { parentId } = req.params;

    const userId = req.headers["userid"];
    let contents = [];
    if(!parentId) {
      contents = await fileSystemRepo.getFileSystemRoots(parentId, userId);
    }
    contents = await fileSystemRepo.getFolderContents(parentId, userId);

    res.json(contents);
  } catch (err) {
    next(err);
  }
});

router.post("/folder", async (req, res, next) => {
  try {
    const { parentId, name } = req.body;
    const userId = req.headers["userid"];
    errorCheckService.checkParameters({ parentId, name, userId });
    const newFolder = await fileSystemRepo.createFolder({
      parentId,
      name,
      userId,
    });
    res.status(201).json(newFolder);
  } catch (err) {
    next(err);
  }
});

router.post("/file", async (req, res, next) => {
  try {
    const { parentId, name, size } = req.body;
    const userId = req.headers["userid"];
    errorCheckService.checkParameters({ parentId, name, userId, size });
    const newFile = await fileSystemRepo.createFile({
      parentId,
      name,
      userId,
      size,
    });

    res.status(201).json(newFile);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/rename", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;
    const userId = req.headers["userid"];
    errorCheckService.checkParameters({ newName, userId });
    const updatedItem = await fileSystemRepo.renameFileSystemItem(
      id,
      newName,
      userId,
    );
    res.json(updatedItem);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const userId = req.headers["userid"];

    await fileSystemRepo.deleteFileSystemItem(id, userId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get("/assets/icons", async (req, res, next) => {
  try {
    const zipPath = path.resolve("assets/filesystem.zip");
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="filesystem-icons.zip"'
    );
    res.setHeader( "Cache-Control", "public, max-age=31536000, immutable" );
    res.sendFile(zipPath);
  } catch (err) {
    next(err);
  }
});

export default router;