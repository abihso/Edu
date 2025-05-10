import mongoose from "mongoose";

const examResultSchema = new mongoose.Schema(
  {
    studentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      required: true,
      enum: ["1st Term", "2nd Term", "3rd Term"],
    },
    academic_year: {
      type: String,
      required: true,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    marks: {
      class_test: { type: Number, default: 0 },
      end_of_term: { type: Number, default: 0 },
      total: { type: Number, default: 0 }, // auto-calculated when both marks exist
    },
    published: {
      type: Boolean,
      default: false, // Marks will be unpublished until confirmed
    },
  },
  { timestamps: true }
);

export const ExamsResults = mongoose.model("ExamResult", examResultSchema);
