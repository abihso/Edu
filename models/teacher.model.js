import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  fname : {
    type:"string",
    required :[true,"First name must be provided"],
  },
  oname : {
    type:"string",
    required : [true,"Other name must be provided"],
  },
  address : {
    type:"string",
    required : [true,"Address must be provided"],
    
  },
  class : {
    type:"string",
    required : [true,"Class must be provided"],
  },
  comment : {
    type:"string",
    required :[true,"Comment must be provided"],
  },
  email : {
    type:"string",
    unique : true,
    required : [true,"Email must be provided"],
  },
  subject : {
    type:"string",
    required : [true,"Home Town must be provided"],
  },
  number : {
    type:"string",
    required : [true,"Number must be provided"],
  },
  img : {
    type:"string",
   
  },
  password : {
    type:"string",
    required : [true,"Report this iusse to the developer"],
  }
},{
  timestamps : true
})
export const Teacher = mongoose.model("Teacher",teacherSchema)

