import db from "../../utility/db/knex/knex.js";

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