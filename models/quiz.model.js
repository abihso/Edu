import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  question : {
    type:"string",
    required :[true,"First name must be provided"],
  },
  optiona : {
    type:"string",
    required : [true,"optiona must be provided"],
  },
  optionb : {
    type:"string",
    required : [true,"optionb must be provided"],
  },
  optionc : {
    type:"string",
    required : [true,"optionc must be provided"],
  },
  optiond : {
    type:"string",
    required : [true,"optiond must be provided"],
  },
  correct : {
    type:"string",
    required : [true,"correct must be provided"],
  },
  code : {
    type:"string",
    required : [true,"code must be provided"],
  },
  class : {
    type:"string",
    required : [true,"class must be provided"],
  }
},{
  timestamps : true
})
export const Quiz = mongoose.model("Quiz",quizSchema)

