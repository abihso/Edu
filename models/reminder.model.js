import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  title : {
    type:"string",
    required : [true,"Title must be provided"]
  },
  message : {
    type:"string",
    required : [true,"Title must be provided"]
  },
  email : {
    type:"string",
    required : [true,"Email must be provided"]
  },
},{
  timestamps : true
})

export const Reminder = mongoose.model("Reminder",reminderSchema)