import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  fname : {
    type:"string",
    required :[true,"First name must be provided"],
  },
  oname : {
    type:"string",
    required : [true,"Other name must be provided"],
  },
  parentname : {
    type:"string",
    required : [true,"Parent full name must be provided"],
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
  location : {
    type:"string",
    required : [true,"Home Town must be provided"],
  },
  number : {
    type:"string",
    required : [true,"Number must be provided"],
  },
  occupation : {
    type:"string",
    required :[true,"Occupation must be provided"],
  },
  img : {
    type:"string",
    required : true
  },
  password : {
    type:"string",
    required : [true,"Report this iusse to the developer"],
  }
},{
  timestamp : true
})

export const Student = mongoose.model("Student",studentSchema)

