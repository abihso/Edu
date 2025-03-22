import express from "express"
import { Student } from "../models/student.model.js"
import { hashpassword } from "../utils/hash-password.js"
import bcrypt from "bcrypt"
import { generateTokensAndSetCookie } from "../utils/jwt.js"
import { verifyUserStudent } from "../middleware/protectedRoute.js"
import { Fees } from "../models/fees.model.js"
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const router = express.Router()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirExists = (folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  };
  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let folder;
      if (req.path.includes("/upload-documents")) {
        folder = path.join(__dirname, "../uploads/students/documents");
      } 
      if (req.path.includes("/")) {
        
        folder = path.join(__dirname, "../uploads/students/images");
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
    if (req.path.includes("/") && !allowedFileTypes.images.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only images (JPG, PNG, GIF) are allowed."), false);
    }
    cb(null, true); 
  };
  const upload = multer({ storage,fileFilter });

router.post("/",upload.single("img"),async(req,res) => { 
  const data = req.body
  console.log(req.path)
  try {
    const findUser = await Student.findOne({email:data.email})
    if (findUser) return res.status(400).json({message : "user already exist"})
  } catch (error) {
    
  }
  data.password =await hashpassword(data.fname) 
  try {
    const createStudent = new Student({...data,img : req.file.filename})
    await createStudent.save()
    res.status(201).json({success : true, message : "created"})
  } catch (error) {
    res.status(400).json({success : false, message : error.message})
  }

})
router.post("/login/",async (req,res) => {
  const data = req.body
    const findUser = await Student.findOne({email:data.email})
    if (!findUser) return res.status(400).json({message : "Invalid email or password"})
 
  const userVerified = await bcrypt.compare(data.password,findUser.password) 
  if (!userVerified) return res.status(400).json({message : "Invalid email or password"})
    generateTokensAndSetCookie(findUser._id,res)
  findUser.password = ""
  req.user = findUser
  return res.status(200).json(findUser)
})  
router.get("/login-status",verifyUserStudent,(req,res) => {
  return  res.sendStatus(200)

})

router.get("/student-data/:email",async(req,res) => {
  const {email} = req.params
  try {
    const findStudent =  await Student.findOne({email}).select("-password").select("-_id")
    if (findStudent) return res.status(200).json({...findStudent._doc})
  } catch (error) {
    return res.status(400)
  }
})

router.post("/fees",async(req,res) => {
 const data = req.body
 const fees = new Fees(data)
 try {
  const saveFees = await fees.save()
  if (saveFees) return res.status(201).json({message : "Record Saved"})
 } catch (error) {
  return res.status(400)
 }
})

router.get("/profile-pic/:name",(req,res) => {
  const {name} = req.params
  console.log(__dirname)
  const pathToFile = path.join(__dirname,"../uploads","students","images",name)
  console.log(pathToFile)
  return res.status(200).sendFile(pathToFile)
})
export default router