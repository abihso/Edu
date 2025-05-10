import mongoose from "mongoose";

const first_term_examsSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Types.ObjectId,
      required: [true, "techer id name must be provided"],
    },
    studentid: {
      type: mongoose.Types.ObjectId,
      required: [true, "student id must be provided"],
    },
    class: {
      type: "string",
      required: [true, "class must be provided"],
    },
    subject: {
      type: "string",
      required: [true, "subject must be provided"],
    },
    mark: {
      type: "string",
      required: [true, "mark must be provided"],
    },
    published: {
      type: "string",
      required: [true, "published must be provided"],
    },
  },
  {
    timestamps: true,
  }
);
export const First_Term_Exam = mongoose.model("First_Term_Exam",first_term_examsSchema)

