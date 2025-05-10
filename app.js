import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import File from "../models/File.js";
 
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirExists = (folder) => { 
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true }); 
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = path.join(__dirname, "../uploads");

    if (req.path.includes("/upload-documents")) {
      folder = path.join(folder, "documents");
    } else if (req.path.includes("/upload-images")) {
      folder = path.join(folder, "images");
    } else {
      folder = path.join(folder, "others");
    }

    ensureDirExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = {
    documents: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    images: ["image/jpeg", "image/png", "image/gif"]
  };

  if (req.path.includes("/upload-documents") && !allowedFileTypes.documents.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only PDF and Word documents are allowed."), false);
  }
  if (req.path.includes("/upload-images") && !allowedFileTypes.images.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Only images (JPG, PNG, GIF) are allowed."), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter }); 
