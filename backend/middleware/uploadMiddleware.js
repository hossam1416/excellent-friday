import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("يُسمح فقط بصور JPG وPNG وWebP");
    error.status = 400;

    return callback(error);
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
});

export default upload;
