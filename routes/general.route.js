import express from "express"
import { Announcement } from "../models/announcement.model.js"
import { Reminder } from "../models/reminder.model.js" 
import { Quiz } from "../models/quiz.model.js"
import { ExamsResults } from "../models/Results.model.js"
const router = express.Router()

router.get("/announcements",async(req,res) => {
  const data = await Announcement.find({}).sort({createdAt: -1})
  return res.status(200).json({
    ...data
  })
})

router.post("/get/reminder",async(req,res) => {
  const {email} = req.body
  const data = await Reminder.find({email}).sort({createdAt: -1})
  return res.status(200).json({
    ...data
  })
})


router.post("/reminder",async(req,res) => {
  const data = req.body
  try {
    const saveData = new Reminder(data)
    await saveData.save()
  } catch (error) {
    return res.status(404)
  }
  return res.status(201).json({message : "record saved"})
})

router.get("/test/:code/:stclass",async(req,res) => {

  const { code, stclass } = req.params
  
  if(code.length < 1 || stclass.length < 2) return res.sendStatus(400)
  try {
    const questions = await Quiz.find({ code, class: stclass })
    console.log(questions)
    return res.status(200).json({...questions})
  } catch (error) {
    console.log(error)
    return res.sendStatus(400);
  }

})

router.get("/unpublished-results", async (req, res) => {
  try {
    const results = await ExamsResults.aggregate([
      {
        $match: { published: false }, // filter unpublished results
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
          academic_year: 1,
          class: 1,
          subject: 1,
          term: 1,
          marks: 1,
          studentId: "$student._id",
          fullName: { $concat: ["$student.fname", " ", "$student.oname"] },
          email: "$student.email",
          published: 1,
        },
      },
      {
        $group: {
          _id: "$academic_year",
          results: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by academic year
      },
    ]);

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch unpublished results",
      error: error.message,
    });
  }
});

router.get("/publish-results",async (req, res) => {
 try {
   const update = await ExamsResults.updateMany( { published: false}, {$set: { published: true }});   
    return res.status(200).json({message : "Updated"});
 } catch (error) {
   console.log(error);
  return res.status(400).json({ message: "Problem Publishing marks" });
 }
})


export default router