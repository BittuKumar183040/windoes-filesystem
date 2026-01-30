import db from "../../utility/db/knex/knex.js";

const TABLE_NAME = 'filesystem';

export const getFileSystemRoots = async () => {
  return db(TABLE_NAME).whereNull('parentId').select('*');
};

export const getFolderContents = async (parentId) => {
  return db(TABLE_NAME).where({ parentId }).select('*');
};

export const createFolder = async ({ parentId, name, userId }) => {
  const [newFolder] = await db(TABLE_NAME)
    .insert({
      parentId,
      name,
      userId,
      type: 'FOLDER',
      size: null,
      status: 'ACTIVE',
      icon: 0,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .returning('*');
  return newFolder;
};

export const createFile = async ({ parentId, name, userId, size }) => {
  const [newFile] = await db(TABLE_NAME)
    .insert({
      parentId,
      name,
      userId,
      type: 'FILE',
      size,
      status: 'ACTIVE',
      icon: 0,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .returning('*');
  return newFile;
};

export const renameFileSystemItem = async (id, newName) => {
  const [updatedItem] = await db(TABLE_NAME)
    .where({ id })
    .update({ name: newName, updatedAt: Math.floor(Date.now() / 1000) })
    .returning('*');
  return updatedItem;
};

export const deleteFileSystemItem = async (id) => {
  return db(TABLE_NAME).where({ id }).del();
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
}