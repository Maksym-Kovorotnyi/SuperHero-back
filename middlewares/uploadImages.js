const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const { CLOUD_NAME, API_KEY, SECRET_KEY } = process.env;

const ALLOWED_FORMATS = ["jpg", "png", "svg", "webp"];

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "heroes",
    allowedFormats: ALLOWED_FORMATS,
  },
});

const multerUploads = multer({
  storage,
}).single("images");

const handleUpload = (req, res, next) => {
  multerUploads(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    next();
  });
};

module.exports = {
  multerUploads,
  handleUpload,
};
