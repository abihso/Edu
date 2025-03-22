import express from "express"
const router = express.Router()
import { Admin } from "../models/admin.model.js"
import { hashpassword } from "../utils/hash-password.js"
import { verifyUserAdmin } from "../middleware/protectedRoute.js"
import bcrypt from "bcrypt"
import { generateTokensAndSetCookie } from "../utils/jwt.js"
import { Announcement } from "../models/announcement.model.js"
import { TimesTable } from "../models/timestable.model.js"
router.post("/",async(req,res) => { 
  const data = req.body
  try {
    const findUser = await Admin.findOne({email:data.email})
    if (findUser) return res.status(400).json({message : "user already exist"})
  } catch (error) {
  }
  data.password =await hashpassword(data.fullname)
  try {
    const createAdmin =  new Admin(data) 
    await createAdmin.save()
    res.status(201).json({success : true, message : "created"}) 
  } catch (error) {
    res.status(400).json({success : false, message : error})
  }
})
router.post("/login/",async (req,res) => {
  const data = req.body
    const findUser = await Admin.findOne({email:data.email})
    if (!findUser) return res.status(400).json({message : "Invalid email or password"})
 
    const userVerified = await bcrypt.compare(data.password,findUser.password) 
  if (!userVerified) return res.status(400).json({message : "Invalid email or password"})
    generateTokensAndSetCookie(findUser._id,res)
    findUser.password = ""
    req.user = findUser
    return res.status(200).json(findUser)
})

router.get("/login-status",verifyUserAdmin,(req,res) => {
  return  res.sendStatus(200)
})
router.post("/messages",async(req,res) => {
  const data = req.body 
  try {
    const message = new Announcement(data)
    await message.save()
    return res.status(201).json({message : "message saved"})
  } catch (error) {
    return res.status(400).json({message : "message not saved"})
  }   
})
router.post("/timestable",async(req,res) => {
  const data = req.body 
  try {
    const message = new TimesTable(data)
    await message.save()
    return res.status(201).json({message : "message saved"})
  } catch (error) {
    return res.status(400).json({message : "message not saved"})
  }   
})

export default router