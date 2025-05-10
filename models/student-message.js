import mongoose from "mongoose";

const studentMessage = new mongoose.Schema({
  title: {
    type: "String",
    required: [true, "Title must be provided"],
  },
  message: {
    type: "String",
    required: [true, "Message must be provided"],
  },
  teacherid: {
    type: mongoose.Types.ObjectId,
    required: [true, "teacherid must be provided"],
  },
  class_name: {
    type: "String",
    required: [true, "class name must be provided"],
  },
}, {
  timestamps : true
});

export const StudentMessage = mongoose.model("StudentMessage",studentMessage)