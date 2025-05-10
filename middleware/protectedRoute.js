
import jwt from "jsonwebtoken"
import { Student } from "../models/student.model.js"
import { Teacher } from "../models/teacher.model.js"
import { Admin } from "../models/admin.model.js"
export const verifyUserStudent = async (req,res,next) =>{
  try {
    const token = req.cookies.token
    const verified = jwt.verify(token,process.env.JWT_SECRET)
    if(verified){
      const user = await Student.findById(verified.id).select("-password")
      req.user = user
    } else{
      res.sendStatus(401)
    }
    next()
  } catch (error) {
    res.sendStatus(401)
  }
}
export const verifyUserTeacher = async (req, res, next) => {
 
  try {
    const token = req.cookies.token
    const verified = jwt.verify(token,process.env.JWT_SECRET)
    if(verified){
      const user = await Teacher.findById(verified.id).select("-password")
      req.user = user
    } else{
      res.sendStatus(401)
    }
    next()
  } catch (error) {
    res.sendStatus(401)
  }
}
export const verifyUserAdmin = async (req,res,next) =>{
  try {
    const token = req.cookies.token
    const verified = jwt.verify(token,process.env.JWT_SECRET)
    if(verified){
      const user = await Admin.findById(verified.id).select("-password")
      req.user = user
    } else{
      res.sendStatus(401)
    }
    next()
  } catch (error) {
    res.sendStatus(401)
  }
}