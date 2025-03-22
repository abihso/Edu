import mongoose from "mongoose";

const first_term_classSchema = new mongoose.Schema({
  teacher_id : {
    type:"string",
    required :[true,"techer id name must be provided"],
  },
  studentid : {
    type:"string",
    required : [true,"student id must be provided"],
  },
  class : {
    type:"string",
    required : [true,"class must be provided"],
  },
  subject : {
    type:"string",
    required : [true,"subject must be provided"],
  },
  mark : {
    type:"string",
    required : [true,"mark must be provided"],
  }
},{
  timestamps : true
})
export const First_Term_Class = mongoose.model("First_Term_Class",first_term_classSchema)
 
