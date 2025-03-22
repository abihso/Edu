import mongoose from "mongoose";

const announccementSchema = new mongoose.Schema({
  title : {
    type:"string",
    required : [true,"Title must be provided"]
  },
  message : {
    type:"string",
    required : [true,"Title must be provided"]
  },
},{
  timestamps : true
})

export const Announcement = mongoose.model("Announcement",announccementSchema)