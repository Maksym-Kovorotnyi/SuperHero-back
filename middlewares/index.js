const { validateBody } = require("./validateBody");
const { isvalidId } = require("./isValidId");
const { handleUpload, multerUploads } = require("./uploadImages");

module.exports = {
  validateBody,
  isvalidId,
  handleUpload,
  multerUploads,
};
