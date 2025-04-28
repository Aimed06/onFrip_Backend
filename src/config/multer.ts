import multer from "multer"
import { Request } from 'express';
import path from 'path';

const allowedFileTypes = ['.pdf', '.jpeg', '.png', '.jpg'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../api/public/uploads/'));
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const extname = path.extname(file.originalname).toLowerCase();
  console.log("MULTER UPLOADING : ", file);
  if (allowedFileTypes.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .jpeg, .png, and .jpg files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});

export default upload;