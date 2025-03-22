import mongoose from "mongoose";

const timestableSchema = new mongoose.Schema({
  day : {
    type:"string",
    required : [true,"Title must be provided"]
  },
  time : {
    type:"string",
    required : [true,"Title must be provided"]
  },
  teacher : {
    type:"string",
    required : [true,"Title must be provided"]
  },
  class : {
    type:"string",
    required : [true,"Title must be provided"]
  },
  subject : {
    type:"string",
    required : [true,"Title must be provided"]
  },
},{
  timestamps : true
})

export const TimesTable = mongoose.model("TimesTable",timestableSchema)