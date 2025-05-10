import express from "express"
import { Teacher } from "../models/teacher.model.js"
import { hashpassword } from "../utils/hash-password.js"
import { verifyUserTeacher } from "../middleware/protectedRoute.js"
import bcrypt from "bcrypt"
import { generateTokensAndSetCookie } from "../utils/jwt.js"
import { Student } from "../models/student.model.js"
import { ExamsResults } from "../models/Results.model.js"
import { Quiz } from "../models/quiz.model.js"
import { StudentMessage } from "../models/student-message.js"
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Assignment } from "../models/assignment-teacher.js"
import mongoose from "mongoose"


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
      if (req.path.includes("/assignment")) {
        folder = path.join(__dirname, "../uploads/students/documents");
      }else if (req.path.includes("/")) {
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
    
    if (req.path.includes("/assignment")) {
      if (req.path.includes("/assignment") && !allowedFileTypes.documents.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only PDF and Word documents are allowed."), false);
    }
    } else if (req.path.includes("/")) {
       if (
         req.path.includes("/") &&
         !allowedFileTypes.images.includes(file.mimetype)
       ) {
         return cb(
           new Error(
             "Invalid file type. Only images (JPG, PNG, GIF) are allowed."
           ),
           false
         );
       }
    } 

   
    cb(null, true); 
  };
const upload = multer({ storage, fileFilter })
router.post("/", upload.single("img"), async (req, res) => {
  const data = req.body;
  try {
    const findUser = await Teacher.findOne({ email: data.email });
    if (findUser)
      return res.status(400).json({ message: "Teacher already exist" });
  } catch (error) {}
  data.password = await hashpassword(data.fname);
  data.teaherId = `STU-Teacher-${new Date().toISOString().slice(0, 4)}${Math.floor(
    Math.random() * 10000 * 20
  )}`;
  try {
    const createStudent = new Teacher({ ...data, img: req.file.filename });
    await createStudent.save();
    res.status(201).json({ success: true, message: "created" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
router.post("/assignment", upload.single("file"),async (req, res) => {
  const { body } = req
  body.img_dir = req.file.filename
  try {
    const newAssignment = new Assignment(body)
    await newAssignment.save()
  } catch (error) {
    return res
      .status(400)
      .json({ message: "File failed to save", success: false });
    }
    return res.status(200).json({ message: "File saved", success: true });
})

router.get("/all-assignments/:id",async (req, res) => {
  const { id } = req.params
  let findAssignments;
  try {
     findAssignments = await Assignment.find({ teacherid: id })
    if(findAssignments.length < 1) return res.status(200).json({ message: "No assignment submitted by you yet", success: true });
  } catch (error) {
     return res
       .status(400)
       .json({ message: "No assignments", success: false });
  }
  return res.status(200).json({ ...findAssignments });
})
router.get("/assignment/:name", (req, res) => {
  const { name } = req.params;
  const pathToFile = path.join(
    __dirname,
    "../uploads",
    "students",
    "documents",
    name
  );
  return res.status(200).sendFile(pathToFile);
})

router.post("/login",async (req,res) => { 
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

router.post("/quiz",async(req,res) => {
  const data = req.body
  const quiz = new Quiz(data)
  try {
    await quiz.save() 
  } catch (error) {
    return res.status(400).json({message : error})
  }
  return res.status(201).json({message : "question saved"})
})
router.get("/login-status", verifyUserTeacher, (req, res) => {
  
  return res.status(200).json({
    user: req.user,
  });
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
  const pathToFile = path.join(__dirname,"../uploads","teacher","images",name)
  return res.status(200).sendFile(pathToFile)
})

router.post("/student-message", async (req, res) => {
  const { body } = req
  let message 
  try {
    message = new StudentMessage(body)
    await message.save()
  } catch (error) {
    return res.status(400).json({ message: "could not save message", success: false })
    
  }
  return res
    .status(201)
    .json({ message: "saved", success: true });
})

/////////////////////Marks///////////////////////////////
router.post("/marks", async (req, res) => {
  try {
    const { studentid, class_name, teacher_id, subject, semester, test, mark } =
      req.body;
    let term = ""
    let marks = {}
    if (semester === "first") {
      term = "1st Term";
    } else if (semester == "second") {
      term = "2nd Term";
    } else if (semester == "third") {
      term = "3rd Term";
    } else {
       return res
         .status(400)
         .json({ success: false, message: "Select term" });
    }
    
    if (test == "class") {
      marks.class_test = Number(mark)
    } else if (test == "exams") {
      marks.end_of_term = Number(mark);
    } else {
      return res.status(400).json({ success: false, message: "Select Class / Exams" });
    }
   
      
    

    // Validate term
    const validTerms = ["1st Term", "2nd Term", "3rd Term"];
    if (!validTerms.includes(term)) {
      return res.status(400).json({ success: false, message: "Invalid term." });
    }

    // Find if the student already has marks for the given subject, term
    let existingResult = await ExamsResults.findOne({
      studentid,
      class: class_name, // Ensure class_name is mapped to the `class` field
      subject,
      term,
    });


    if (existingResult) {
      // Update existing record with new marks
      if(existingResult.published == true)  return res.status(400).json({ success: false, message: "Results has already been published" });
      if (marks.class_test !== undefined) {
        existingResult.marks.class_test = marks.class_test;
      }
      if (marks.end_of_term !== undefined) {
        existingResult.marks.end_of_term = marks.end_of_term;
      }

      // Compute total when both marks are available
      if (
        existingResult.marks.class_test !== undefined &&
        existingResult.marks.end_of_term !== undefined
      ) {
        existingResult.marks.total =
          existingResult.marks.class_test + existingResult.marks.end_of_term;
      }

      await existingResult.save();
      return res
        .status(200)
        .json({ success: true, message: "Marks updated successfully!" });
    } else {
      // Create a new record
      const newExamResult = new ExamsResults({
        studentid,
        class: class_name, // Ensure class_name is mapped to the `class` field
        subject,
        teacher_id,
        term,
        academic_year: "2025", // Example for academic year, can be dynamic
        marks: {
          class_test: marks.class_test || 0,
          end_of_term: marks.end_of_term || 0,
          total: (marks.class_test || 0) + (marks.end_of_term || 0), // auto-calculated
        },
      });

      await newExamResult.save();
      return res
        .status(201)
        .json({ success: true, message: "Marks saved successfully!" });
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "Failed in saving marks",
      error: error.message,
    });
  }
});

/////Teacher should be able to view his student marks////
router.get("/students/marks/:class_name/:teacher_id", async (req, res) => {
  const { class_name, teacher_id } = req.params;

  try {
    // Fetch the teacher's subjects
    const teacher = await Teacher.findById(teacher_id);
    if (!teacher) {
      return res
        .status(404)
        .json({ message: "Teacher not found", success: false });
    }
    console.log(teacher)
    // const teacherSubjects = teacher.subject || [];

    // Fetch results for students in that class, taught by that teacher in their subjects
    const results = await ExamsResults.aggregate([
      {
        $match: {
          class: class_name,
          teacher_id: new mongoose.Types.ObjectId(teacher_id),
          subject: teacher.subject, // match only the teacher's subjects
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "studentid",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $project: {
          studentId: "$student._id",
          fullName: { $concat: ["$student.fname", " ", "$student.oname"] },
          email: "$student.email",
          class: "$class",
          subject: "$subject",
          term: "$term",
          academic_year: "$academic_year",
          marks: "$marks",
        },
      },
    ]);

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving student marks",
      error: error.message,
    });
  }
});




export default router