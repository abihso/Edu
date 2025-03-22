import express from "express"
import { Announcement } from "../models/announcement.model.js"
import { Reminder } from "../models/reminder.model.js" 
import { Quiz } from "../models/quiz.model.js"
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
    console.log(error)
    return res.status(404)
  }
  return res.status(201).json({message : "record saved"})
})

router.get("/test/:code/:stclass",async(req,res) => {

  const {code,stclass} = req.params
  try {
    const questions = await Quiz.find({code,class:stclass})
    return res.status(200).json({...questions})
  } catch (error) {
    return res.status(400)
  }

})




export default router