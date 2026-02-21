import db from "../../utility/db/knex/knex.js";
const FILESYSTEM = 'filesystem';
const FILEDETAILS = 'filedetails';

export const getFileSystemRoots = async () => {
  return db(FILESYSTEM)
    .where({parentId: null})
    .select('*');
};

export const getFolderContents = async (parentId, userId) => {
  return db(FILESYSTEM)
    .where('parentId', parentId)
    .andWhere(function () {
      this.where('userId', userId).orWhere('userId', 'global');
    })
    .select('*');
};

export const getFullFileSystem = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  const rows = await db(FILESYSTEM)
    .where(function () {
      this.where('userId', userId).orWhere('userId', 'global');
    })
    .andWhere('type', 'FOLDER')
    .select('*');

  console.log("Fetched rows:", rows.length);
  const nodeMap = new Map();

  rows.forEach(row => {
    nodeMap.set(row.id, {
      id: row.id, userId: row.userId,
      parentId: row.parentId,
      name: row.name, type: row.type,
      icon: row.icon,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      children: []
    });
  });

  const roots = [];
  rows.forEach(row => {
    const node = nodeMap.get(row.id);

    if (row.parentId) {
      const parent = nodeMap.get(row.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });
  return roots;
};

export const createFolderRepo = async ({ parentId, name, userId }) => {
  const [newFolder] = await db(FILESYSTEM)
    .insert({
      parentId,
      name,
      userId,
      type: 'FOLDER',
      status: 'ACTIVE',
      icon: "folder",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .returning('*');
  return newFolder;
};

export const createFileRepo = async ({ parentId, name, userId, size }) => {
  const extension = name.includes('.') ? name.split('.').pop() : "";
  const [newFile] = await db(FILESYSTEM)
    .insert({
      parentId,
      name,
      userId,
      type: 'FILE',
      status: 'ACTIVE',
      icon: extension,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .returning('*');
    await db(FILEDETAILS)
      .insert({
        id: newFile.id,
        size: 0,
        status: 'ACTIVE',
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
      })
  return newFile;
};

export const renameFileSystemItem = async (id, newName, userId) => {
  const [updatedItem] = await db(FILESYSTEM)
    .where({ id, userId })
    .update({ name: newName, updatedAt: Math.floor(Date.now() / 1000) })
    .returning('*');
  return updatedItem;
};

export const deleteFileSystemItem = async (id, userId) => {
  return db(FILESYSTEM).where({ id, userId }).del();
};

export const insertRecord = async ({ userId, fileTag, filename }) => {
  const [file] = await db("filesystem")
    .insert({ userId, fileTag, filename, status: "ACTIVE", updatedAt: Math.floor(Date.now() / 1000) })
    .returning("*");
  return file;
};

export const updateUserFileStatus = async ({ userId, fileTag, status }) => {
  const updatedCount = await db("filesystem")
    .where({ userId, fileTag })
    .update({ status });
  return updatedCount;
};

export const getUserFilesDetails = async ({ userId, fileTag, status }) => {
  return db("filesystem")
    .where({ userId, fileTag })
    .whereIn("status", status)
    .orderBy("updatedAt", "desc")
    .select("*");
};

export const getFilebyFileAndUserId = async ({fileId, userId}) => {
  return db("filesystem")
    .where({ id: fileId, userId:userId })
    .select("*")
    .first();
};