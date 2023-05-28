const fs = require("fs");
const path = require("path");

/**
 * Directory to be sorted, if not present the default is the current directory.
 * @const {Object}
 */
const FILE_EXTENSIONS = {
  Images: [
    ".jpg",
    ".jpeg",
    ".jpe",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
    ".ico",
  ],
  Videos: [
    ".webm",
    ".mpeg",
    ".ogg",
    ".mp4",
    ".avi",
    ".wmv",
    ".mov",
    ".qt",
    ".flv",
  ],
  Audio: [".flac", ".mp3", ".wav"],
  Documents: [
    ".doc",
    ".docx",
    ".pdf",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
  ],
};

/**
 * Directory to be sorted, if not present the default is the current directory.
 * @const {string}
 */
const CURRENT_DIR = process.argv[2] || "./";

/**
 * Moves the given file to a folder.
 * @param {string} destination Target directory where the new file will be
 * @param {string} file File to be moved
 */
const moveFile = async (destination, file) => {
  const sourcePath = path.resolve(CURRENT_DIR, file);
  const destinationPath = path.join(destination, file);

  try {
    await fs.promises.rename(sourcePath, destinationPath);
    console.log(`${file} moved to ${destinationPath}`);
  } catch (error) {
    console.error("Unable to move file: ", error);
  }
};

/**
 * Check if folder exists, if not then create it
 * @param {string} folder Directory to check/create
 */
const createFolder = async (folder) => {
  try {
    await fs.promises.mkdir(folder, { recursive: true });
  } catch (error) {
    console.error("Unable to create directory: ", error);
  }
};

/**
 * Find the extension of a file and return the foldername it belongs to.
 * @param {string} file Filename with extension
 * @return {string} Returns foldername by extension
 */
const findExtension = (file) => {
  const fileExtension = path.extname(file);
  const [folderName] =
    Object.entries(FILE_EXTENSIONS).find(([, extensions]) =>
      extensions.includes(fileExtension)
    ) || [];

  return folderName;
};

/**
 * Traverses through folder and moves the files to their corresponding folder.
 */
const readFolder = async () => {
  try {
    const files = await fs.promises.readdir(CURRENT_DIR);

    for (const file of files) {
      const destination = findExtension(file);
      if (destination) {
        const destinationPath = path.resolve(CURRENT_DIR, destination);
        await createFolder(destinationPath);
        await moveFile(destinationPath, file);
      }
    }
  } catch (error) {
    console.error("Unable to scan directory: ", error);
  }
};

readFolder();
