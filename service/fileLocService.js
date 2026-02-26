import logger from "#logger";
import fs from "fs/promises";
import path from "path";
import { getUserFilesDetails } from "./repo/filesystemRepo.js";

const ROOT_FOLDER = process.env.ROOT_FOLDER || "/data";

export const uploadFile = async ({ id, userId, file }) => {
  logger.info( `Initialed file upload for id/filename: ${id}, userId: ${userId}`);

  const dirPath = path.join(ROOT_FOLDER, "storage", userId);

  await fs.mkdir(dirPath, { recursive: true });
  const filePath = path.join(dirPath, `${id}`);

  if (file?.data) {
    await fs.writeFile(filePath, file.data);
    logger.trace(`Uploaded file saved at: ${filePath}`);
  } else {
    await fs.writeFile(filePath, "");
    logger.trace(`Empty file created at: ${filePath}`);
  }
  const stats = await fs.stat(filePath);
  logger.info(`Successfully file uploaded at loc: ${filePath}`)
  return stats;
};

export const getFile = async ({ id, userId }) => {
  let fileRecord = await getUserFilesDetails({id, userId})

  if (!fileRecord || !fileRecord.length) {
    throw { status: 404, error:`No File found for user ${id}`}
  }
  return getFileByEntity(fileRecord[0])
};

const getFileByEntity = async (fileRecord) => {

  logger.info(`Getting file from - Root:${ROOT_FOLDER}, ${JSON.stringify(fileRecord)}`)
  const location = path.join(ROOT_FOLDER, "storage", fileRecord.userId, );

  logger.info(`Looking into Location: ${location}`)
  
  if (!fs.existsSync(location)) {
    throw { status: 404, error: `File not found on disk at ${location}`};
  }

  const buffer = fs.readFileSync(location);

  const ext = path.extname(fileRecord.filename).toLowerCase();
  const mimeMap = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp"
  };

  const mimetype = mimeMap[ext] || "application/octet-stream";
  return { buffer, filename: fileRecord.filename, mimetype, location };
}