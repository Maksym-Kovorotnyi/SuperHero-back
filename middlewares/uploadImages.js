const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const { CLOUD_NAME, API_KEY, SECRET_KEY } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: SECRET_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "heroes",
  },
});

const multerUploads = multer({
  storage,
  limits: { fileSize: 3145728 },
}).single("images");

const handleUpload = (req, res, next) => {
  multerUploads(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File size limit exceeded" });
      }
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

module.exports = {
  handleUpload,
};
