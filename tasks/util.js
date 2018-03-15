/**
 * Transform function that returns the contents of the given file.
 *
 * @param {string} filePath
 * @param {File} file
 */
function transformGetFileContents(filePath, file) {
  return file.contents.toString('utf8');
}

module.exports = {
  // Transform functions.
  transforms: {
    getFileContents: transformGetFileContents
  }
};
