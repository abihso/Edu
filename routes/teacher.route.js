import express from "express"
import { Teacher } from "../models/teacher.model.js"
import { hashpassword } from "../utils/hash-password.js"
import { verifyUserTeacher } from "../middleware/protectedRoute.js"
import bcrypt from "bcrypt"
import { generateTokensAndSetCookie } from "../utils/jwt.js"
import { Student } from "../models/student.model.js"
import { First_Term_Class } from "../models/first_term_class.model.js"
import { First_Term_Exam } from "../models/first_term_exam.model.js"
import { Second_Term_Class } from "../models/second_term_class.model.js"
import { Second_Term_Exam } from "../models/second_term_exam.model.js"
import { Third_Term_Class } from "../models/third_term_class.model.js"
import { Third_Term_Exam } from "../models/third_term_exam.model.js"
import { Quiz } from "../models/quiz.model.js"
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
        
        folder = path.join(__dirname, "../uploads/teacher/images");
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
  const upload = multer({ storage,fileFilter })
router.post("/",upload.single("img"),async(req,res) => { 
  const data = req.body
  try {
    const findUser = await Teacher.findOne({email:data.email})
    if (findUser) return res.status(400).json({message : "Teacher already exist"})
  } catch (error) {
  }
  data.password =await hashpassword(data.fname)
  try {
    const createStudent = new Teacher({...data,img : req.file.filename})
    await createStudent.save()
    res.status(201).json({success : true, message : "created"})
  } catch (error) {
    res.status(400).json({success : false, message : error.message})
  }
})
router.post("/login/",async (req,res) => {
  const data = req.body
    const findUser = await Teacher.findOne({email:data.email})
    if (!findUser) return res.status(400).json({message : "Invalid email or password"})
 
    const userVerified = await bcrypt.compare(data.password,findUser.password) 
  if (!userVerified) return res.status(400).json({message : "Invalid email or password"})
    generateTokensAndSetCookie(findUser._id,res)
    findUser.password = ""
    req.user = findUser
    return res.status(200).json(findUser)
})
router.get("/all-students/:class_name",async(req,res) => {
  const { class_name } = req.params
  try {
    const data = await Student.find({class : class_name}).select("-password")
    return res.status(200).json({...data})
  } catch (error) {
    return res.status(400)
  }
})

router.post("/marks",async(req,res) => {
  try {
    const {semester,test,mark,studentid,class_name,teacher_id,subject} = req.body
    if(test == "class"){
      if(semester == "first"){
        const findRecord = await First_Term_Class.findOne({studentid,class : class_name,teacher_id,subject})
        if (findRecord) return res.status(400).json({message : "Mark already exist for this user",success : false})
        const saveReord = new First_Term_Class({
          mark,studentid, class : class_name,teacher_id,subject
        })
        await saveReord.save()
      }
      if(semester == "second"){
        const findRecord = await Second_Term_Class.findOne({studentid,class : class_name,teacher_id,subject})
        if (findRecord) return res.status(400).json({message : "Mark already exist for this user",success : false})
        const saveReord = new Second_Term_Class({
          mark,studentid, class : class_name,teacher_id,subject
        })
        await saveReord.save()
      }
      if(semester == "third"){
        const findRecord = await Third_Term_Class.findOne({studentid,class : class_name,teacher_id,subject})
        if (findRecord) return res.status(400).json({message : "Mark already exist for this user",success : false})
        const saveReord = new Third_Term_Class({
          mark,studentid, class : class_name,teacher_id,subject
        })
        await saveReord.save()
      }
    }
    if(test == "exams"){
      if(semester == "first"){
        const findRecord = await First_Term_Exam.findOne({studentid,class : class_name,teacher_id,subject})
        if (findRecord) return res.status(400).json({message : "Mark already exist for this user",success : false})
        const saveReord = new First_Term_Exam({
          mark,studentid, class : class_name,teacher_id,subject
        })
        await saveReord.save()
      }
      if(semester == "second"){
        const findRecord = await Second_Term_Exam.findOne({studentid,class : class_name,teacher_id,subject})
        if (findRecord) return res.status(400).json({message : "Mark already exist for this user",success : false})
        const saveReord = new Second_Term_Exam({
          mark,studentid, class : class_name,teacher_id,subject
        })
        await saveReord.save()
      }
      if(semester == "third"){
        const findRecord = await Third_Term_Exam.findOne({studentid,class : class_name,teacher_id,subject})
        if (findRecord) return res.status(400).json({message : "Mark already exist for this user",success : false})
        const saveReord = new Third_Term_Exam({
          mark,studentid, class : class_name,teacher_id,subject
        })
        await saveReord.save()
      }
    }
  } catch (error) {
    res.status(400).json({message : "Problem saving mark"}) 
  }
  res.status(200).json({message : "Marks saved",success:true})
})
router.post("/quiz",async(req,res) => {
  const data = req.body
  const quiz = new Quiz(data)
  try {
    await quiz.save() 
  } catch (error) {
    return res.status(400)
  }
  return res.status(201).json({message : "question saved"})
})
router.get("/login-status",verifyUserTeacher,(req,res) => {
  return  res.sendStatus(200)
})

router.get("/teacher-data/:email",async(req,res) => { 
  const {email} = req.params
  try {
    const findTeacher =  await Teacher.findOne({email}).select("-password").select("-_id")
    if (findTeacher) return res.status(200).json({...findTeacher._doc})
  } catch (error) {
    return res.status(400)
  } 
})
router.get("/profile-pic/:name",(req,res) => {
  const {name} = req.params
  console.log(__dirname)
  const pathToFile = path.join(__dirname,"../uploads","teacher","images",name)
  console.log(pathToFile)
  return res.status(200).sendFile(pathToFile)
})
export default router