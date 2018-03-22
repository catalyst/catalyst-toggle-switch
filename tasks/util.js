/**
 * Transform function that returns the contents of the given file.
 *
 * @param {string} filePath
 *   The file path.
 * @param {File} file
 *   The file.
 * @returns {string}
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
