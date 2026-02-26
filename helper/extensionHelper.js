export const getFileExtension = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf('.');
  
  if (lastDotIndex === -1) {
    return '';
  }
  return fileName.substring(lastDotIndex + 1);
}