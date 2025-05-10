import mongoose from "mongoose"

const assignmentSchema = new mongoose.Schema({
  teacherid: {
    type: mongoose.Types.ObjectId,
    required: [true, "Must provide the teacher id"],
  },
  code: {
    type: "String",
    required: [true, "Must provide the code"],
  },
  class_name: {
    type: "String",
    required: [true, "Must provide the class"],
  },
  img_dir: {
    type: "String",
    required: [true, "Must provide the path to the folder"],
  },
}, {
  timestamps : true
});

export const Assignment = mongoose.model("Assignment",assignmentSchema)