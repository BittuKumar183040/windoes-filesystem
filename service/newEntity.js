import { createFileRepo, createFolderRepo } from "./repo/filesystemRepo.js";
import { uploadFile } from './fileLocService.js'
import logger from "#logger";

const MAX_RETRIES = 1000;

export const createFile = async (parentId, name, userId, size) => {
  const {filename, extension} = parseFileName(name);
  const data = await createWithRetry(
    { parentId, name, userId, size },
    createFileRepo,
    (original, attempt) => ({ ...original, name: `${filename} (${attempt}).${extension}`})
  );
  logger.info(`${data.userId}: New data added into database with id ${data.id}, name: ${data.name} `)
  await uploadFile({id: data.id, userId})
  return data;
};

export const createFolder = async (parentId, name, userId) => {
  return createWithRetry(
    { parentId, name, userId },
    createFolderRepo,
    (original, attempt) => ({ ...original, name: `${original.name} (${attempt})`})
  );
};

const createWithRetry = async (originalData, createFn, renameFn) => {
  let attempt = 0;
  let data = { ...originalData };
  let entity = null;

  while (attempt < MAX_RETRIES) {
    try {
      entity = await createFn(data);
      break;
    } catch (err) {
      if (!isDuplicateFolderError(err)) {
        throw err;
      }

      attempt += 1;
      data = renameFn(originalData, attempt);
    }
  }

  if (!entity) {
    throw new Error("Unable to create item after multiple attempts");
  }
  return entity;
};


const parseFileName = (name) => {
  const lastDotIndex = name.lastIndexOf('.');
  
  if (lastDotIndex === -1) {
    return { filename: name, extension: '' };
  }
  
  return {
    filename: name.substring(0, lastDotIndex),
    extension: name.substring(lastDotIndex + 1),
  };
};

const isDuplicateFolderError = (err) => {
  return ( err?.code === "23505" || err?.code === "ER_DUP_ENTRY" );
};
